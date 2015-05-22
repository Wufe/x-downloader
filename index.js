var Downloader = require( './lib/downloader.class' )
var readline = require('readline')
var regexp = require('node-regexp')
var ArgumentParser = require('argparse').ArgumentParser

var downloader = new Downloader()

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var re = regexp()
  .start('http')
  .maybe('s')
  .must('://')
  .maybe('www.')
  .somethingBut(regexp.space)
  .must('.')
  .somethingBut(regexp.space)
  .toRegExp()

var parser = new ArgumentParser({
  version: '0.1',
  addHelp:true,
  description: 'XDownloader'
});
parser.addArgument(
  [ '-u', '--url' ],
  {
    help: 'url to be downloaded'
  }
);
parser.addArgument(
  [ '-o', '--output' ],
  {
    help: 'output name for the file'
  }
);
parser.addArgument(
  [ '-i', '--interactive' ],
  {
    help: 'start in interactive mode',
    action: 'storeTrue'
  }
);

var args = parser.parseArgs();

if(!args["interactive"]){
	url = args["url"]
	if(url == null){
		console.log("No url is given, exiting")
	}else{
		if(!re.test(url)){
			console.log("Malformed url, exiting")
			process.exit()
		}
		if(args["output"] == null){
			downloader.download(url)
		}else{
			downloader.download(url, args["output"])
		}
	}
}else{
	console.log("Interactive mode selected\n")
	_url = undefined
	rl.question("Insert url: ", function(url) {
  		if(!re.test(url)){
  			console.log("Malformed url, exiting")
			process.exit()
  		}

		rl.question("Insert output name (leave blank to keep original filename): ", function(output){
  			if(output == ""){
				downloader.download(url)
  			}else{
  				downloader.download(url, output)
  			}
  			rl.close()
  		})
	})
}

//downloader.download( "http://download.thinkbroadband.com/5MB.zip", "5MB2.zip" );
//tdownloader.download( "http://www.xdccfinder.it/2014-06-15_00003.jpg" );