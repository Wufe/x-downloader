var Downloader = function(){

	if( false === ( this instanceof Downloader ) ){
        return new Downloader();
    }

	this.url = require( 'url' );
	this.fs = require( 'fs' );
	this.path = require( 'path' );
	this.http = require( 'http' );
	this.https = require( 'https' );

	this.thread_count = 4;
	this.chunk_size = 512*1024;

	this.chunks 			= [];
	this.file_descriptor 	= undefined;
	this.URI 				= undefined;
	this.filename 			= undefined;

	this.download = function( URI, callback, scope ){

		URI = this.url.parse( URI );
		this.URI = URI;
		var filename = this.path.basename( URI[ "path" ] );
		this.filename = filename;
		console.log( "\nDownloading " + filename + "..\n" );
		this.getHeaders( URI, function( headers ){
			if( headers === undefined ||
				headers[ "accept-ranges" ] === undefined ||
				headers[ "accept-ranges" ] != "bytes" ||
				headers[ "content-length" ] === undefined ){
				console.log( "Il download non accetta un resume." );
			}else{
				
				this.content_length = parseInt( headers[ "content-length" ] );
				this.createDummy( this.filename, this.content_length, function(){
					var chunk_length = Math.floor( this.content_length / this.thread_count );
					var chunk_count = 0;
					var Chunk = require( './chunk.class' );
					for( var i = 0; i < this.thread_count; i++ ){
						var thread_obj = {
							index: i,
							start: chunk_count,
							end: ( i == ( this.thread_count.length -1 ) ? this.content_length : chunk_count + chunk_length ),
							stack: new Buffer( 0 ),
							written: 0,
							content_length: this.content_length,
							filename: this.filename,
							URI: this.URI,
							chunk_size: this.chunk_size,
							file_descriptor: this.file_descriptor,
							onEnd: {
								callback: function(){
									//console.log( 'ended' );
									var ended = true;
									for( var a = 0; a < this.chunks.length; a++ ){
										if( this.chunks[ a ].ended == false ){
											ended = false;
										}
									}
									if( ended ){
										console.log( "Ended.\n" );
										if( typeof callback == 'function' ){
											callback.call( scope || this );
										}
									}
								},
								scope: this
							}
						};
						var chunk = new Chunk();
						chunk.init( this, thread_obj );
						
						
						chunk_count += chunk_length;
						this.chunks.push( chunk );
					}
					//console.log( this.chunks );

				}, this );
			}
		}, this );
	};


	this.getHeaders = function( URI, callback, scope ){
		var options = {
			'method': 'HEAD',
			'host': URI.host,
			'port': URI.port || 80,
			'path': URI.path
		};
		var req = this.http.request( options, function( res ){
			if( typeof callback == 'function' ){
				callback.call( scope || this, res.headers );
			}
			req.abort();
		});
		req.end();
	};

	this.createDummy = function( filename, length, callback, scope ){
		var me = this;
		this.fs.open( './' + filename, 'w', undefined, function( err, fd ){
			me.fs.write( fd, new Buffer( length ), 0, length, 0, function(){
				me.file_descriptor = fd;
				if( typeof callback == 'function' ){
					callback.call( scope || me );
				}
			})
		});
	};

};

module.exports = function(){
	return new Downloader();
};