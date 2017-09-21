require "json"
require 'net/http'
require 'openssl'
require "pry"

def mine(name)
  file_path = File.expand_path "#{name}.json", $data_dir
  raise "That's (#{name}.json) not a name!" unless File.exist? file_path
  JSON.load(File.open(file_path))
end

def bury(name, stuff)
  file_path = File.expand_path "#{name}.json", $build_dir
  File.open(file_path, "w") do |file|
    file.puts JSON.pretty_generate(stuff)
  end
end

def filterify(things, on_object)
  things.inject({}) do |target, saved_thing|
    target[saved_thing] = on_object[saved_thing]
    target
  end
end

def hash_data_strings(names)
  lang_order = ["en", "jp", "kr", "fr", "de", "it"]

  lang_order.zip(names).to_h
    # .map({}) do |memory, kv|
    #   lang, name = kv
    #   memory[lang] = name
    #   memory
    # end
end

def hash_awakenings(obj)
  entries = obj["entries"].to_a
  min, max = obj["rarity_min"], obj["rarity_max"]
  return nil if min == max

  awakenings = (min..max).to_a.collect do |level|
    index = level - min
    raise "rarity mismatch?!" unless entries[index][1]["rarity"] == level
    awakening = {}

    source_awakening = entries[index][1]["awakening"]
    #awakening["id"]  = entries[index][0] #Add "id" so we can see the picture

    unless level == max
      next unless source_awakening
      awakening["materials"] = source_awakening["materials"]
    end

    [level, awakening]
  end

  #binding.pry if obj["name"]["en"] == "Artisan Lid"
  # God damn it Artisan Lid
  # There are units that have awakening entries, but
  # don't have materials listed for that listing
  if awakenings.any?(&:nil?) then nil else awakenings.to_h end
end

def download_file(url, dest_name)
  uri = URI(url)
  opts = {
    use_ssl: uri.scheme == 'https',
    verify_mode: OpenSSL::SSL::VERIFY_NONE
  }
  Net::HTTP.start(uri.host, uri.port, **opts) do |http|
    request = Net::HTTP::Get.new uri

    http.request request do |response|
      size = response['content-length'].to_i

      begin
        open dest_name, 'wb' do |file|
          response.read_body do |chunk|
            file.write chunk
          end
        end
      ensure
        filesize = File.stat(dest_name).size
        if filesize != size
          puts "File download of #{dest_name}"
          puts " from #{url}"
          puts " was a different size: #{filesize}"
          puts " than expected:        #{size}"
          puts " so deleting it because it's probably bogus"
          FileUtils.rm dest_name
          raise "File failed to download"
        end
      end
    end
  end
end

def download_from_wiki(list_images, target_path)
  FileUtils.mkdir_p target_path

  puts "Downloading pics"

  list_images.each_slice(50).each do |series|
    query = {
      action: "query",
      titles: series.join("|"),
      format: "json",
      prop: "imageinfo",
      iiprop: "url",
      indexpageids: true
    }
    req = HTTParty.get("https://exvius.gamepedia.com/api.php", query: query)
    results = JSON.parse(req.body)

    results["query"]["pageids"].each do |page|
      begin
        pinfo = results["query"]["pages"][page]
        next if pinfo.has_key? "missing"

        filename = pinfo["title"].partition(':').last

        if File.exist? "#{target_path}/#{filename}"
          puts "Skipping downloading #{filename} because we already have it"
          next
        end

        download_file(
          pinfo["imageinfo"].first["url"],
          "#{target_path}/#{filename}"
        )
      rescue NoMethodError
        puts "Failed to download a file, continuing..."
        binding.pry
        puts pinfo
      end
    end
  end
  puts "Finished downloading pics"
end

