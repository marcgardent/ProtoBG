
📐mytemplate:
  tags: 📐nunjucks
  📐definition: |
    {{ 'https://raw.githubusercontent.com/tjakubo2/Decker/master/Decker.ttslua' | plainText }}

📐mydata:
  description: hello!

📐myDocument:
  tags: 📐document
  📐template: 📐mytemplate
  📐parameters: {}
  📑foreach: { 📑is: 📐mydata }

📦myBundle:
  tags: 📦bundle
  📦filename: myFilenameZip.zip
  📑foreach: { 📑is: 📐myDocument }#