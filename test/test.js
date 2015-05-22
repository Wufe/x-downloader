var assert = require("assert")
var should = require('should');
var fs = require('fs');
var Downloader = require("../lib/downloader.class.js")

var oldLog = console.log
var emptyF = function(){}

describe('XDOWNLOADER', function(){
	var obj = undefined
	var _headers = undefined
	var _done = undefined
	var filename = "testfile"
	var length = 1024

	describe('Initialization', function(){
		it('Can instantiate', function(){
			obj = new Downloader()
			obj.should.be.an.instanceOf(Object)
		})

		describe("Has all functions", function(){
			it("has download", function(){
				obj.download.should.be.a.Function
			})
			it("has getHeaders", function(){
				obj.getHeaders.should.be.a.Function
			})
			it("has createDummy", function(){
				obj.createDummy.should.be.a.Function
			})
			it("has writeFunction", function(){
				obj.writeFunction.should.be.a.Function
			})
			it("has writeDummy", function(){
				obj.writeDummy.should.be.a.Function
			})
		})
	})

	describe("getHeaders Function", function(){
		var func = function(headers){
			_headers = headers
			_done()
		}
		it("Has no errors", function(done){
			_done = done
			obj.getHeaders("http://www.google.com", func, undefined)
		})
		it("Has got headers", function(){
			should.exist(_headers)
		})
	})

	describe("createDummy Function", function(){
		var func = function(){
			_done()
		}
		it("Has no errors", function(done){
			_done = done
			obj.createDummy(filename, length, func, undefined)
		})
		it("file exsists", function(){
			fs.existsSync(filename).should.equal(true)
		})
		it("has the right size", function(){
			var stats = fs.statSync(filename)
 			var fileSize = stats["size"]
 			fileSize.should.equal(length)
		})
		after(function(){
    		fs.unlinkSync(filename)
  		})
	})

	describe("writeDummy Function", function(){
		var local_length = 100
		var position = 100

		var func = function(){
			_done()
		}
		it("Has no errors", function(done){
			_done = done
			obj.writeDummy(local_length, position, func, undefined)
		})
	})

	describe("writeFunction Function", function(){
		var func = function(){
			_done()
		}
		it("Has no errors", function(done){
			_done = done
			obj.writeFunction(func, undefined)
		})
	})

	describe("download Function", function(){
		this.timeout(30000);
		var func = function(){
			_done()
		}

		var filename = "2014-06-15_00003.jpg"
		var altname = "r.jpg"

		it("downloads file without name", function(done){
			_done = done
			obj.download( "http://www.xdccfinder.it/"+filename, undefined, true, func);
		})

		it("default filename exists", function(){
			fs.existsSync(filename).should.equal(true)
		})
		
		it("downloads file with name", function(done){
			_done = done
			obj.download( "http://www.xdccfinder.it/"+filename, altname, true, func);
		})

		it("filename exsists", function(){
			fs.existsSync(altname).should.equal(true)
		})

		after(function(){
    		//fs.unlinkSync(filename)
    		fs.unlinkSync(altname)
  		})
	})
})