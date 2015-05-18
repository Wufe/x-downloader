var Chunk = function(){

	this.fs = require( 'fs' );
	this.http = require( 'http' );
	this.https = require( 'https' );
	
	this.parent = undefined;

	this.ended = false;

	var end = undefined;
	var URI = undefined;
	var range = undefined;
	var onEnd = undefined;
	var index = undefined;
	var start = undefined;
	var stack = undefined;
	var range = undefined;
	var written = undefined;
	var filename = undefined;
	var chunk_size = undefined;
	var content_length = undefined;
	var file_descriptor = undefined;

	var classScope = this;

	/*
	this.end = undefined;
	this.URI = undefined;
	this.range = undefined;
	this.onEnd = undefined;
	this.index = undefined;
	this.start = undefined;
	this.stack = undefined;
	this.written = undefined;
	this.filename = undefined;
	this.chunk_size = undefined;
	this.content_length = undefined;
	this.file_descriptor = undefined;*/

	var onDataF = function( data ){
		stack = Buffer.concat( [ stack, data ] );
		if( stack.length >= chunk_size ){
			var newB = stack;
			stack = new Buffer( 0 );
			var pos = start + written;
			write( newB, pos, function(){
				written += newB.length;	
			}, this );
		}
	};

	var onEndF = function(){
		var newB = stack;
		stack = new Buffer( 0 );
		var pos = start + written;
		write( newB, pos, function(){
			written += newB.length;
			classScope.ended = true;
			if( typeof onEnd.callback == 'function' ){
				onEnd.callback.call( onEnd.scope || this );
			}
		}, this );
	};

	var startDownload = function(){

		range = "bytes=" + start + "-" + end;

		var options = {
			host: URI.host,
			port: URI.port || 80,
			path: URI.path,
			method: 'GET',
			headers: { "range": range }
		};

		console.log( "Thread #" + index + " range: " + range );

		var http = require( 'http' );
		var https = require( 'https' );

		var ssl = URI.protocol.indexOf( 'https' ) === 0 ? true : false;
		if( ssl ){
			var req = https.request( options, function( res ){
				res.on( 'data', onDataF );
				res.on( 'end', onEndF );
			});
			req.end();
		}else{
			
			var req = http.request( options, function( res ){
				res.on( 'data', onDataF );
				res.on( 'end', onEndF );
			});
			req.end();
		}

	};

	

	var write = function( buffer, position, callback, scope ){
		var fs = require( 'fs' );
		//console.log( "Writing " + buffer.length + " bytes on position " + position + " for the thread #" + index + "." );
		fs.write( file_descriptor, buffer, 0, buffer.length, position, function( err, written, buf ){
			if( typeof callback == 'function' ){
				callback.call( scope || this );
			}
		});
	};

	this.init = function( parent, my_data ){
		this.parent = parent;

		end = my_data.end;
		URI = my_data.URI;
		range = my_data.range;
		onEnd = my_data.onEnd;
		index = my_data.index;
		start = my_data.start;
		stack = my_data.stack;
		written = my_data.written;
		filename = my_data.filename;
		chunk_size = my_data.chunk_size;
		content_length = my_data.content_length;
		file_descriptor = my_data.file_descriptor;


		/*setInterval( function(){
			console.log( start );
		}, 1000 );*/

		startDownload();

	};


};


module.exports = function(){
	return new Chunk();
};