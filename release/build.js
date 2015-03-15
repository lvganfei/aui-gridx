(function () {
	'use strict';
	angular.module('aui.grid.i18n', []);
	angular.module('aui.grid', ['aui.grid.i18n']);
})();
(function() {
	'use strict';

	var module = angular.module('aui.grid');

	module.controller('auiGridController',
		['$scope', '$element', '$attrs', 'Grid', function ($scope, $element, $attrs, Grid) {
			console.log($scope.auiGrid);
			$scope.grid = new Grid($scope.auiGrid);

			console.log($scope.grid);
			

		}]);

	module.directive('auiGrid', function() {
		return {
			templateUrl: 'aui-grid/aui-grid',
			scope: {
				auiGrid: '=',
				getExternalScopes: '&?externalScopes' //optional functionwrapper around any needed external scope instances
			},
			replace: true,
			transclude: true,
			controller: 'auiGridController',
			link: function($scope, $elem) {
				console.log($scope.auiGrid);
				// console.log
			}
		};
	});
})();

(function(){
angular.module('aui.grid')
.factory('Grid', ['$q', '$compile', '$parse', '$timeout', 'GridCore',
	function($q, $compile, $parse, $timeout, GridCore) {
		console.log('in side grid constuctor');
		console.log('Grid core', GridCore);
		var dummyFunc = function(){};
		var version = {
			// summary:
			//		Version number of the Dojo Toolkit
			// description:
			//		Hash about the version, including
			//
			//		- major: Integer: Major version. If total version is "1.2.0beta1", will be 1
			//		- minor: Integer: Minor version. If total version is "1.2.0beta1", will be 2
			//		- patch: Integer: Patch version. If total version is "1.2.0beta1", will be 0
			//		- flag: String: Descriptor flag. If total version is "1.2.0beta1", will be "beta1"
			//		- revision: Number: The Git rev from which dojo was pulled
			major: 0,
			minor: 0,
			patch: 1,
			flag: "",
			toString: function(){
				return this.major + "." + this.minor + "." + this.patch + this.flag;
			}
		};
		var Grid = function Grid(options){
			var self = this;

			this.isIE = false;
			this.postCreate(options);
		};

		Grid.prototype = GridCore.prototype;

		Grid.prototype.version = version;

		Grid.prototype._setTextDirAttr = function(textDir){
			// summary:
			//		 Seamlessly changes grid 'textDir' property on the fly.
			// textDir:
			//		Grid text direction
			if(this.textDir != textDir){
				this.textDir = textDir;
				this.header.refresh();
				if(this.edit){
					this.edit._initAlwaysEdit();
				}
				this.body.refresh();
			}
		},

		Grid.prototype.getTextDir = function(colId, text){
			var col = this._columnsById[colId],
				textDir = (col && col.textDir) || this.textDir;
			return textDir = (textDir === "auto") ? _BidiSupport.prototype._checkContextual(text) : textDir;
		},

		Grid.prototype.getTextDirStyle = function(colId, text){
			var textDir = this.getTextDir(colId, text);
			return textDir ? " direction:" + textDir + ";" : "";
		},

		Grid.prototype.enforceTextDirWithUcc = function(colId, text){
			var textDir = this.getTextDir(colId, text);
			//var LRE = '\u202A', RLE = '\u202B', PDF = '\u202C';
			return textDir ? (textDir === "rtl" ? '\u202B' : '\u202A') + text + '\u202C' : text;
		},
		//textDir bidi support end

		Grid.prototype.coreModules = [];
		// Grid.prototype.coreModules = [
		// 	//Put default modules here!
		// 	Header,
		// 	View,
		// 	Body,
		// 	VLayout,
		// 	HLayout,
		// 	VScroller,
		// 	HScroller,
		// 	ColumnWidth,
		// 	Focus
		// ],

		Grid.prototype.coreExtensions = [
			//Put default extensions here!
			// Query
		],
	
		Grid.prototype.postCreate = function(){
			// summary:
			//		Override to initialize grid modules
			// tags:
			//		protected extension
			var t = this;
			// t.inherited(arguments);
			// if(t.touch === undefined){
			// 	t.touch = has('ios') || has('android');
			// }
			// if(t.touch){
			// 	domClass.add(t.domNode, 'gridxTouch');
			// }else{
			// 	domClass.add(t.domNode, 'gridxDesktop');
			// }
			// if(!t.isLeftToRight()){
			// 	domClass.add(t.domNode, 'gridxRtl');
			// }
			// if(t.summary){
			// 	t.domNode.setAttribute('summary', t.summary);
			// }
			//in case gridx is not a root level package, it should still work
			// t.nls = i18n.getLocalization('gridx', 'gridx', t.lang) || nls;
			t._eventFlags = {};
			t.modules = t.coreModules.concat(t.modules || []);
			t.modelExtensions = t.coreExtensions.concat(t.modelExtensions || []);
			// t.lastFocusNode.setAttribute('tabIndex', t.domNode.getAttribute('tabIndex'));
			t._initEvents(t._compNames, t._eventNames);
			t._init();
			//resize the grid when zoomed in/out.
			t.connect(metrics, 'onFontResize', function(){
				t.resize();
			});
		},
	
		Grid.prototype.startup = function(){
			// summary:
			//		Startup this grid widget
			// tags:
			//		public extension
			if(!this._started){
				// this.inherited(arguments);
				// this._deferStartup.callback();
			}
		},
	
		Grid.prototype.destroy = function(){
			// summary:
			//		Destroy this grid widget
			// tags:
			//		public extension
			// this._uninit();
			// this.inherited(arguments);
		},

	/*=====
		// autoHeight: Boolean
		//		If true, the grid's height is determined by the total height of the rows in current body view,
		//		so that there will never be vertical scroller bar. And when scrolling the mouse wheel over grid body,
		//		the whole page will be scrolled. Note if this is false, only the grid body will be scrolled.
		autoHeight: false,
		// autoWidth: Boolean
		//		If true, the grid's width is determined by the total width of the columns, so that there will
		//		never be horizontal scroller bar.
		autoWidth: false,
		// summary: String
		//
		//
		summary: '',
		// touch: Boolean
		//		Whether grid is run in touch environment
		//		If undefined, automatically set to true on mobile devices (like ios or android)
		//touch: undefined,
	=====*/

		Grid.prototype.resize = function(changeSize){
			// summary:
			//		Resize the grid using given width and height.
			// tags:
			//		public
			// changeSize: Object?
			//		An object like {w: ..., h: ...}.
			//		If omitted, the grid will re-layout itself in current width/height.
			var t = this, ds = {};
			if(changeSize){
				if(t.autoWidth){
					changeSize.w = undefined;
				}
				if(t.autoHeight){
					changeSize.h = undefined;
				}
				domGeometry.setMarginBox(t.domNode, changeSize);
			}
			t._onResizeBegin(changeSize, ds);
			t._onResizeEnd(changeSize, ds);
		},

		//Private-------------------------------------------------------------------------------
		Grid.prototype._onResizeBegin = function(){},
		Grid.prototype._onResizeEnd = function(){},

		Grid.prototype._escapeId = function(id){
			return String(id).replace(/\\/g, "\\\\").replace(/\"/g, "\\\"").replace(/\'/g, "\\\'");
		},

		Grid.prototype._encodeHTML = function(id){
			return String(id).replace(/\"/g, "&quot;");
		},

		//event handling begin
		Grid.prototype._compNames =['Cell', 'HeaderCell', 'Row', 'Header'],
	
		Grid.prototype._eventNames = [
			'TouchStart', 'TouchEnd',
			'Click', 'DblClick',
			'MouseDown', 'MouseUp', 
			'MouseOver', 'MouseOut', 
			'MouseMove', 'ContextMenu',
			'KeyDown', 'KeyPress', 'KeyUp'
		],
	
		Grid.prototype._initEvents = function(objNames, evtNames){
			var i = 0, j, comp, evt, evtName;
			while(comp = objNames[i++]){
				for(j = 0; evt = evtNames[j++];){
					evtName = 'on' + comp + evt;
					this[evtName] = this[evtName] || dummyFunc;
				}
			}
		},

		Grid.prototype._connectEvents = function(node, connector, scope){
			for(var t = this,
					m = t.model,
					eventName,
					eventNames = t._eventNames,
					len = eventNames.length,
					i = 0; i < len; ++i){
				eventName = eventNames[i];
				m._cnnts.push(on(node, eventName.toLowerCase(), lang.hitch(scope, connector, eventName)));
			}
		},
	
		Grid.prototype._isConnected = function(eventName){
			return this[eventName] !== dummyFunc;
		},
		//event handling end

		Grid.prototype._isCtrlKey = function(evt){
			// summary:
			//		On Mac Ctrl+click also opens a context menu. So call this to check ctrlKey instead of directly call evt.ctrlKey
			//		if you need to implement some handler for Ctrl+click.
			return has('mac') ? evt.metaKey : evt.ctrlKey;
		};

		return Grid;
	}]);
})();

(function() {
/*=====
	return declare([], {
		// summary:
		//		This is the logical grid (also the base class of the grid widget), 
		//		providing grid data model and defines a module/plugin framework
		//		so that the whole grid can be as flexible as possible while still convenient enough for
		//		web page developers.

		setStore: function(store){
			// summary:
			//		Change the store for grid.
			// store: dojo.data.*|dojox.data.*|dojo.store.*
			//		The new data store
		},

		setColumns: function(columns){
			// summary:
			//		Change all the column definitions for grid.
			// columns: Array
			//		The new column structure
		},

		row: function(row, isId, parentId){
			// summary:
			//		Get a row object by ID or index.
			//		For asyc store, if the data of this row is not in cache, then null will be returned.
			// row: Integer|String
			//		Row index of row ID
			// isId: Boolean?
			//		If the row parameter is a numeric ID, set this to true
			// returns:
			//		If the params are valid and row data is in cache, return a row object, else return null.
		},

		column: function(column, isId){
			// summary:
			//		Get a column object by ID or index
			// column: Integer|String
			//		Column index or column ID
			// isId: Boolean
			//		If the column parameter is a numeric ID, set this to true
			// returns:
			//		If the params are valid return a column object, else return NULL
		},

		cell: function(row, column, isId, parentId){
			// summary:
			//		Get a cell object
			// row: gridx.core.Row|Integer|String
			//		Row index or row ID or a row object
			// column: gridx.core.Column|Integer|String
			//		Column index or column ID or a column object
			// isId: Boolean?
			//		If the row and coumn params are numeric IDs, set this to true
			// returns:
			//		If the params are valid and the row is in cache return a cell object, else return null.
		},

		columnCount: function(){
			// summary:
			//		Get the number of columns
			// returns:
			//		The count of columns
		},

		rowCount: function(parentId){
			// summary:
			//		Get the number of rows.
			// description:
			//		For async store, the return value is valid only when the grid has fetched something from the store.
			// parentId: String?
			//		If provided, return the child count of the given parent row.
			// returns:
			//		The count of rows. -1 if the size info is not available (using server side store and never fetched any data)
		},

		columns: function(start, count){
			// summary:
			//		Get a range of columns, from index 'start' to index 'start + count'.
			// start: Integer?
			//		The index of the first column in the returned array.
			//		If omitted, defaults to 0, so grid.columns() gets all the columns.
			// count: Integer?
			//		The number of columns to return.
			//		If omitted, all the columns starting from 'start' will be returned.
			// returns:
			//		An array of column objects
		},

		rows: function(start, count, parentId){
			// summary:
			//		Get a range of rows, from index 'start' to index 'start + count'.
			// description:
			//		For async store, if some rows are not in cache, then there will be NULLs in the returned array.
			// start: Integer?
			//		The index of the first row in the returned array.
			//		If omitted, defaults to 0, so grid.rows() gets all the rows.
			// count: Integer?
			//		The number of rows to return.
			//		If omitted, all the rows starting from 'start' will be returned.
			// returns:
			//		An array of row objects
		},

		onModulesLoaded: function(){
			// summary:
			//		Fired when all grid modules are loaded. Can be used as a signal of grid creation complete.
			// tags:
			//		callback
		}
	});
=====*/
angular.module('aui.grid')
.factory('GridCore', ['GridUtil', '$compile', '$parse', '$timeout', function(GridUtil){
	var delegate = GridUtil.delegate,
		isFunc = GridUtil.isFunction,
		isString = GridUtil.isString,
		hitch = GridUtil.hitch;

	function getDepends(mod){
		var p = mod.moduleClass.prototype;
		return (p.forced || []).concat(p.optional || []);
	}

	function configColumns(columns){
		var cs = {}, c, i, len;
		if(lang.isArray(columns)){
			for(i = 0, len = columns.length; i < len; ++i){
				c = columns[i];
				c.index = i;
				c.id = c.id || String(i + 1);
				cs[c.id] = c;
			}
		}
		return cs;
	}

	function mixinAPI(base, apiPath){
		if(apiPath){
			for(var path in apiPath){
				var bp = base[path],
					ap = apiPath[path];
				if(bp && lang.isObject(bp) && !isFunc(bp)){
					mixinAPI(bp, ap);
				}else{
					base[path] = ap;
				}
			}
		}
	}

	function normalizeModules(self){
		var mods = self.modules,
			len = mods.length,
			modules = [],
			i, m;
		for(i = 0; i < len; ++i){
			m = mods[i];
			if(isString(m)){
				try{
					m = require(m);
				}catch(e){
					console.error(e);
				}
			}
			if(lang.isArray(m)){
				modules = modules.concat(m);
			}else{
				modules.push(m);
			}
		}
		mods = [];
		len = modules.length;
		for(i = 0; i < len; ++i){
			m = modules[i];
			if(isFunc(m)){
				m = {
					moduleClass: m
				};
			}
			if(m){
				var mc = m.moduleClass;
				if(isString(mc)){
					try{
						mc = m.moduleClass = require(mc);
					}catch(e){
						console.error(e);
					}
				}
				if(isFunc(mc)){
					mods.push(m);
					continue;
				}
			}
			console.error("The " + (i + 1 - self.coreModules.length) +
				"-th declared module can NOT be found, please require it before using it:", m);
		}
		self.modules = mods;
	}
	
	function checkForced(self){
		var registeredMods = _Module._modules,
			modules = self.modules, i, j, k, p, deps, depName, err;
		for(i = 0; i < modules.length; ++i){
			p = modules[i].moduleClass.prototype;
			deps = (p.forced || []).concat(p.required || []);
			for(j = 0; j < deps.length; ++j){
				depName = deps[j];
				for(k = modules.length - 1; k >= 0; --k){
					if(modules[k].moduleClass.prototype.name === depName){
						break;
					}
				}
				if(k < 0){
					if(registeredMods[depName]){
						modules.push({
							moduleClass: registeredMods[depName]
						});
					}else{
						err = 1;	//1 as true
						console.error("Forced/Required dependent module '" + depName +
							"' is NOT found for '" + p.name + "' module.");
					}
				}
			}
		}
		if(err){
			throw new Error("Some forced/required dependent modules are NOT found.");
		}
	}

	function removeDuplicate(self){
		var i = 0, m, mods = {}, modules = [];
		for(; m = self.modules[i]; ++i){
			mods[m.moduleClass.prototype.name] = m;
		}
		for(i in mods){
			modules.push(mods[i]);
		}
		self.modules = modules;
	}

	function checkModelExtensions(self){
		var modules = self.modules,
			i, modExts;
		for(i = modules.length - 1; i >= 0; --i){
			modExts = modules[i].moduleClass.prototype.modelExtensions;
			if(modExts){
				[].push.apply(self.modelExtensions, modExts);
			}
		}
	}

	function arr(self, total, type, start, count, pid){
		var i = start || 0, end = count >= 0 ? start + count : total, r = [];
		for(; i < end && i < total; ++i){
			r.push(self[type](i, 0, pid));
		}
		return r;
	}

	function mixin(self, component, name){
		var m, a, mods = self._modules;
		for(m in mods){
			m = mods[m].mod;
			a = m[name + 'Mixin'];
			if(isFunc(a)){
				a = a.apply(m);
			}
			lang.mixin(component, a || {});
		}
		return component;
	}

	function initMod(self, deferredStartup, key){
		var mods = self._modules,
			m = mods[key],
			mod = m.mod,
			d = mod.loaded;
		if(!m.done){
			m.done = 1;
			new DeferredList(array.map(array.filter(m.deps, function(depModName){
				return mods[depModName];
			}), hitch(self, initMod, self, deferredStartup)), 0, 1).then(function(){
				if(mod.load){
					mod.load(m.args, deferredStartup);
				}else if(d.fired < 0){
					d.callback();
				}
			});
		}
		return d;
	}

	function GridCore() {}

	GridCore.prototype = {
		setStore: function(store){
			if(this.store !== store){
				this.store = store;
				this.model.setStore(store);
			}
		},

		setData: function(data, skipAutoParseColumn){
			var c;

			this.model.setData(data);
			if(!skipAutoParseColumn){
				c = this.model._parseStructure(data);
				this.setColumns(c);
			}
		},

		setColumns: function(columns){
			var t = this;
			t.structure = columns;
			//make a shallow copy of columns here so one structure can be used in different grids.
			t._columns = array.map(columns, function(col){
				return lang.mixin({}, col);
			});
			t._columnsById = configColumns(t._columns);
			
			if(t.edit){			//FIX ME: this is ugly
								//this will not run in the first setColumns function
				t.edit._init();
			}
			if(t.model){
				t.model._cache.onSetColumns(t._columnsById);
			}
		},

		row: function(row, isId, parentId){
			var t = this;
			if(typeof row === "number" && !isId){
				row = t.model.indexToId(row, parentId);
			}
			if(t.model.byId(row)){
				t._rowObj = t._rowObj || mixin(t, new Row(t), "row");
				return delegate(t._rowObj, {
					id: row
				});
			}
			return null;
		},

		column: function(column, isId){
			var t = this, c, a, obj = {};
			if(typeof column === "number" && !isId){
				c = t._columns[column];
				column = c && c.id;
			}
			c = t._columnsById[column];
			if(c){
				t._colObj = t._colObj || mixin(t, new Column(t), "column");
				for(a in c){
					if(t._colObj[a] === undefined){
						obj[a] = c[a];
					}
				}
				return delegate(t._colObj, obj);
			}
			return null;
		},

		cell: function(row, column, isId, parentId){
			var t = this, r = row instanceof Row ? row : t.row(row, isId, parentId);
			if(r){
				var c = column instanceof Column ? column : t.column(column, isId);
				if(c){
					t._cellObj = t._cellObj || mixin(t, new Cell(t), "cell");
					return delegate(t._cellObj, {
						row: r,
						column: c
					});
				}
			}
			return null;
		},

		columnCount: function(){
			return this._columns.length;
		},

		rowCount: function(parentId){
			return this.model.size(parentId);
		},

		columns: function(start, count){
			return arr(this, this._columns.length, 'column', start, count);	//gridx.core.Column[]
		},

		rows: function(start, count, parentId){
			return arr(this, this.rowCount(parentId), 'row', start, count, parentId);	//gridx.core.Row[]
		},

		onModulesLoaded: function(){},

		//Private-------------------------------------------------------------------------------------
		_init: function(){
			var t = this, s,
				d = t._deferStartup = new Deferred();
			t.modules = t.modules || [];
			t.modelExtensions = t.modelExtensions || [];

			if(t.touch){
				if(t.touchModules){
					t.modules = t.modules.concat(t.touchModules);
				}
			}else if(t.desktopModules){
				t.modules = t.modules.concat(t.desktopModules);
			}

			if(!t.store){
				s = t._parseData(t.data);
			}else{
				s = t.store;
			}

			Deferred.when(s, function(){
				t.setColumns(t.structure);
				
				normalizeModules(t);
				checkForced(t);
				removeDuplicate(t);
				checkModelExtensions(t);

				//Create model before module creation, so that all modules can use the logic grid from very beginning.
				t.model = new Model(t);
				t.when = hitch(t.model, t.model.when);
				t._create();
				t._preload();
				t._load(d).then(function(){
					t.onModulesLoaded();
				});
			});
		},

		_uninit: function(){
			var t = this, mods = t._modules, m;
			for(m in mods){
				mods[m].mod.destroy();
			}
			if(t.model){
				t.model.destroy();
			}
		},

		_create: function(){
			var t = this,
				i = 0, mod,
				mods = t._modules = {};
			for(; mod = t.modules[i]; ++i){
				var m, cls = mod.moduleClass,
					key = cls.prototype.name;
				if(!mods[key]){
					mods[key] = {
						args: mod,
						mod: m = new cls(t, mod),
						deps: getDepends(mod)
					};
					if(m.getAPIPath){
						mixinAPI(t, m.getAPIPath());
					}
				}
			}
		},

		_preload: function(){
			var m, mods = this._modules;
			for(m in mods){
				m = mods[m];
				if(m.mod.preload){
					m.mod.preload(m.args);
				}
			}
		},

		_load: function(deferredStartup){
			var dl = [], m;
			for(m in this._modules){
				dl.push(initMod(this, deferredStartup, m));
			}
			return new DeferredList(dl, 0, 1);
		},

		//used when creating grid without store
		_defaultData: [
			{id: 1, name: 'Dojo'},
			{id: 2, name: 'jQuery'},
			{id: 3, name: 'ExtJS'},
			{id: 4, name: 'YUI'}
		],

		_parseData: function(data){
			var t = this;

			if(typeof data ==='object' && data.constructor === Array){
				this.store = new Memory({data: data});
			}else{					//use default data
				this.store = new Memory({
					data: this._defaultData
				});
			}
			if(!t.structure){
				this.structure = this._parseStructure(data);
			}
			return 1;
		},

		_parseStructure: function(data){
			if(!data || typeof data !== 'object'){
				return [
					{id: 1, name: 'id', field: 'id'},
					{id: 2, name: 'name', field: 'name'}
				];
			}
			
			var s = {},
				len = data.length,
				keys, i, j, kl, key,
				struct = [];

			for(i = 0; i < len; i++){
				keys = Object.keys(data[i]);
				kl = keys.length;
				for(j = 0; j < kl; j++){
					s[keys[j]] = 1;
				}
			}

			for(key in s){
				struct.push({id: key, name: key, field: key});
			}

			return struct;
		}
	};

	return GridCore;
}]);
})();

(function() {
	angular.module('aui.grid')
	.service('GridUtil', ['$q', '$compile', '$parse', '$timeout', function() {
		var s = {
			delegate: function() {},

			isFunction: function() {},

			isString: function() {},
			
			hitch: function() {}
		}

		return s;
	}]);

})();
angular.module('aui.grid').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('aui-grid/aui-grid',
    "<div>hello world</div>"
  );

}]);
