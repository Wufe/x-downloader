var Downloader = require( './lib/downloader.class' );
var downloader = new Downloader();
downloader.download( "http://download.thinkbroadband.com/5MB.zip", "5MB2.zip" );