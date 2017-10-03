require "pry"
require "httparty"

require "fileutils"
require "yaml"

require_relative "Datafunc.rb"

$base_path = File.dirname(__FILE__)
$build_dir = File.expand_path $base_path, "docs/build"
$data_dir = File.expand_path  $base_path, "DataMine"

##
# Need to handle the extra images I've included.
# FileUtils.rmdir $build_dir
# FileUtils.mkdir $build_dir

$pretty = !ARGV.include?("--ugly")

puts "git submodule update --remote"
result = `git submodule update --remote`
if result.empty? and not ARGV.include? "--force"
  puts "DataMine is up-to-date, exiting"
  exit
end
puts result
puts "done"

$config = YAML.load_file "UpdateWebsiteDataConfig.yaml"

#build id -> category list for $config["items"]
#$config["items"]["itemToCategory"]
itemToCategory = {}
$config["items"]["category"].each do |category, items|
  items.each do |itemID|
    itemToCategory[itemID] = category
  end
end
$config["items"]["itemToCategory"] = itemToCategory;

#CondenseItems
mine("items")
  .keep_if do |key, values|
    values["type"] == "Awakening" || ($config["items"]["include"].include? key)
  end
  .map do |key, values|
    values["name"] = hash_data_strings values["strings"]["names"]
    values["awakeningType"] = $config["items"]["itemToCategory"][key]
    [key, values]
  end
  .inject({}) do |memory, kv|
    id, data = kv
    memory[id] = filterify [
      "name",
      #custom things
      "awakeningType"
      ], data
    memory
  end
  .tap do |blob|
    target_path = "#{$build_dir}/img/items"
    FileUtils.mkdir_p target_path

    images = blob.values.map {|item| "File:Icon-#{item["name"]["en"]}.png" }
    download_from_wiki(images, target_path)

    bury("items", blob)
  end

mine("units")
  .keep_if do |key, unit|
    unit.has_key? "rarity_min" #
  end
  .map do |key, values|
    values["name"] = hash_data_strings values["names"]
    values["awakenings"] = hash_awakenings values
    values["growthPatterns"] = hash_growth_patterns values
    [key, values]
  end
  .keep_if do |key, values|
    (
      values["awakenings"] and
      not values["awakenings"].any?(&:nil?) and
      values["name"]["en"].is_a? String and #JP only stuff fucks up so great
      values["name"]["en"] != "<na>" #Doesn't exist?
    )
  end
  .inject({}) do |memory, kv|
    key, value = kv
    memory[key] = filterify [
      "rarity_min",
      "rarity_max",
      "name",
      "sex",
      "game",
      "is_summonable",
      #custom things
      "growthPatterns",
      "awakenings"
    ], value
    memory
  end
  .tap do |blob|
    target_path = "#{$build_dir}/img/units"
    FileUtils.mkdir_p target_path

    images = blob.map {|key, data|
      (data["rarity_min"]..data["rarity_max"])
      .to_a
      .map {|star| "File:Unit-#{data["name"]["en"]}-#{star}.png"}
    }.flatten

    download_from_wiki(images, target_path)

    bury("units", blob)
  end
#end mine(units)

[
  #I'm so sorry this feels really bad.
  ["http://exviusdb.com/static/img/assets/ui/unit_charastand.png", "#{$build_dir}/img/units/unit_charastand.png"],
  ["https://exvius.gamepedia.com/skins/Exvius/resources/images/frame-item.png", "#{$build_dir}/img/items/frame-item.png"],
].each do |item|
  source, target = item
  unless File.exist? target
    download_file(source, target)
  else
    puts "Skipping downloading #{File.basename target}"
  end
end

f_path = "#{$build_dir}/img/shared"
FileUtils.mkdir_p f_path
download_from_wiki(
  (1..5).to_a.map {|star| "File:Rarity-#{star}.png"},
  f_path
)

