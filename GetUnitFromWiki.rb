require "httparty"
require "nokogiri"
require "pry"
require "mediawiki_api"

require_relative "Wiki"
star = "★"

ARGV.map {|unit| get_awakening_materials(unit)}
  .inject({}) do |memory, unit|
    unit.each do |star, items|
      items.each do |name, amount|
        unless memory.has_key? name
          memory[name] = amount
        else
          memory[name] += amount
        end
      end
    end
    memory
  end
  .sort {|a, b| a[1] <=> b[1]}
  .reverse
  .each do |item|
    puts "%sx %s" % item.reverse
  end
