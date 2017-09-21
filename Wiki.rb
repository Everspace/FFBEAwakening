require "httparty"
require "nokogiri"

def get_unit_page(unit)
  unit.gsub(" ", "_")
  base_url = "https://exvius.gamepedia.com"
  page = HTTParty.get("#{base_url}/#{unit.gsub(" ", "_")}")
  Nokogiri::HTML(page)
end

def get_awakening_materials_table(unit)
  get_unit_page(unit)
    .at_css("span#Awakening_Materials")
    .parent           #get out of the span to the header
    .next_element     #next actual thing rather than a \n
end

##
# Return an object of { #star: {"Material Name": #} ... }
def get_awakening_materials(unit)
  table = get_awakening_materials_table(unit)
  lvs = table.xpath('./tr/th').map(&:text)
    .map(&:strip)
    .map(&:chop) #get rid of the star
    .to_i

  groups = table.xpath('./tr/td')
    .map { |td|
    td.text
    .strip
    .split(/[()]/)
    .map(&:strip)
    .each_slice(2).to_a
    }

  info = {}
  lvs.zip(groups).each do |lv, items|
    i = {}
    items.each do |name, number|
      i[name] = number.to_i
    end

    info[lv] = i
  end

  info
end
