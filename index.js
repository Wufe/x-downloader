var downloads = "http://s03.alldebrid.com/dl/hmj1qy13af/21.mkv\nhttp://s19.alldebrid.com/dl/hmj1r071bb/06.mkv\nhttp://s03.alldebrid.com/dl/hmj1rmc43d/09.mkv\nhttp://s11.alldebrid.com/dl/hmj1s2344d/14.mkv\nhttp://s06.alldebrid.com/dl/hmj1s40831/11.mkv\nhttp://s03.alldebrid.com/dl/hmj1se27f1/22.mkv\nhttp://s06.alldebrid.com/dl/hmj1scfdfd/10.mkv\nhttp://s06.alldebrid.com/dl/hmj1sye08c/19.mkv\nhttp://s06.alldebrid.com/dl/hmj1t0a4cf/16.mkv\nhttp://s06.alldebrid.com/dl/hmj1u04c74/12.mkv\nhttp://s10.alldebrid.com/dl/hmj1ts8a32/08.mkv\nhttp://s01.alldebrid.com/dl/hmj1u221e0/17.mkv\nhttp://s11.alldebrid.com/dl/hmj1u45c81/04.mkv\nhttp://s02.alldebrid.com/dl/hmj1umfa13/23.mkv\nhttp://s01.alldebrid.com/dl/hmj1uk8af8/13.mkv\nhttp://s11.alldebrid.com/dl/hmj1uo71bd/05.mkv";


downloads = downloads.split( "\n" );


var Downloader = require( './lib/downloader.class' );
var downloader = new Downloader();



var downloadNext = function(){
	if( downloads.length > 0 ){
		var thisD = downloads[ 0 ];
		downloads.splice( 0, 1 );
		downloader.download( thisD, function(){
			downloadNext();
		}, this );
	}
};

downloadNext();

/*var buff = new Buffer( "00000000000000000000" );
var fs = require( 'fs' );
fs.open( 'prova.js', 'w', undefined, function( err, fd ){
	fs.write( fd, buff, 0, 20, 0, function(){
		fs.close( fd );
		fs.open( 'prova.js', 'w', undefined, function( err, fd ){
			fs.write( fd, new Buffer([ 48, 49, 50, 51, 52 ]), 0, 5, 2, function( err, writ, buf ){
				fs.close( fd );
			});
		});
	});
});*/