require "bundler/setup"
Bundler.require
require 'open-uri'
require 'json'

URL = 'https://www.pref.shimane.lg.jp/bousai_info/bousai/kikikanri/shingata_taisaku/new_coronavirus_portal.html'
CHARSET = nil
inspection_json_file = "./data/inspection_persons.json"
patients_summary_json_file = "./data/patients_summary.json"
main_summary_json_file = "./data/main_summary.json"

def doc
 Nokogiri::HTML(open(URL), nil, CHARSET)
end

def insperson
  doc.css('table')[0].css('tbody')[0].css('th')[22].text.gsub('人', '')
end

def positive_insperson
  doc.css('table')[0].css('tbody')[0].css('th')[23].text.gsub('人', '')
end

def html_date
  date = doc.css('table')[0].css('tbody')[0].css('th')[21].text.gsub('日', '')
  if Date.today.day == 1
    target = Date.today - 1
    DateTime.new(target.year, target.month, date.to_i).iso8601
  else
    DateTime.new(Date.today.year, Date.today.month, date.to_i).iso8601
  end
end

if __FILE__ == $0
  ENV['TZ'] = 'JP'
  is_update_main_summary = false
  update_date_time = DateTime.parse(html_date)

  # inspection_persons.jsonの更新
  json_data = open(inspection_json_file) do |f|
    JSON.load(f)
  end

  inspection_json_date_time = DateTime.parse(json_data['inspection_persons']['labels'].last)

  # jsonファイルのlabelsとスクレイピング日付の比較
  if (update_date_time.day != inspection_json_date_time.day && update_date_time > inspection_json_date_time)
    is_update_main_summary = true
    json_data['inspection_persons']['date'] = (DateTime.now + Rational(9, 24)).strftime("%Y\/%m/%d %H:%M")
    json_data['inspection_persons']['labels'].push(update_date_time)
    json_data['inspection_persons']['datasets'][0]['data'].push(insperson.to_i)
    open(inspection_json_file, 'w') do |f|
      f.write(JSON.pretty_generate(json_data))
    end
  end

  # patients_summary.jsonの更新
  json_data = open(patients_summary_json_file) do |f|
    JSON.load(f)
  end

  patients_summary_json_date_time = DateTime.parse(json_data['patients_summary']['data'].last["日付"])

  if (update_date_time.day != patients_summary_json_date_time.day && update_date_time > patients_summary_json_date_time)
    is_update_main_summary = true
    json_data['patients_summary']['date'] = (DateTime.now + Rational(9, 24)).strftime("%Y\/%m/%d %H:%M")
    hash = {"日付": update_date_time, "小計": positive_insperson.to_i}
    json_data['patients_summary']['data'].push(hash)
    open(patients_summary_json_file, 'w') do |f|
      f.write(JSON.pretty_generate(json_data))
    end
  end

  # main_summary.jsonの日付更新
  if is_update_main_summary
    main_summary_json_data = open(main_summary_json_file) do |f|
      JSON.load(f)
    end

    main_summary_json_data['lastUpdate'] = (DateTime.now + Rational(9, 24)).strftime("%Y\/%m/%d %H:%M")
    open(main_summary_json_file, 'w') do |f|
      f.write(JSON.pretty_generate(main_summary_json_data))
    end
  end
end
