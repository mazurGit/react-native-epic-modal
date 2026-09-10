require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = package["name"]
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.author       = package["author"]
  s.source       = { :git => package["repository"]["url"], :tag => s.version.to_s }
  s.platforms    = { :ios => "13.4" }
  s.source_files = "ios/**/*.{h,m,mm}"
  s.dependency "React-Core"
end
