// 셀카피 시작
app.directive('uiGridCellSelection', function($compile){
	  /*
	  Proof of concept, in reality we need on/off events etc.
	  */
	  return {
	    require: 'uiGrid',
	    link: function(scope, element, attrs, uiGridCtrl){
	      // Taken from cellNav
	      //add an element with no dimensions that can be used to set focus and capture keystrokes
	      var gridApi = uiGridCtrl.grid.api
	      var focuser = $compile('<div class="ui-grid-focuser" tabindex="-1"></div>')(scope);
	      element.append(focuser);

	      uiGridCtrl.focus = function () {
	        focuser[0].focus();
	      };
 
	      gridApi.cellNav.on.viewPortKeyDown(scope, function(e){
	        if((e.keyCode===99 || e.keyCode===67) && e.ctrlKey){
	         var cells = gridApi.cellNav.getCurrentSelection();
	         var copyString = '',
	          rowId = cells[0].row.uid;
	         angular.forEach(cells,function(cell){
	           if (cell.row.uid !== rowId){
	             copyString += '\n';
	             rowId = cell.row.uid;
	           }
	           copyString += gridApi.grid.getCellValue(cell.row, cell.col).toString();
	           copyString += '  ';      // copyString += ', ';
	           
	         })
	         // Yes, this should be build into a directive, but this is a quick and dirty example.
	         var textArea = document.getElementById("grid-clipboard");
	         textArea.value = copyString;
	         textArea = document.getElementById("grid-clipboard").select();
	        }
	      })
	      focuser.on('keyup', function(e){
	        
	      })
	    }
	  }
	})
 
app.directive('uiGridClipboard', function(){
	  return {
	    template: '<textarea id="grid-clipboard" ng-model="uiGridClipBoardContents"   style="border-bottom-width:0px;border-right-width:0px"></textarea>',
	    replace: true,
	    link: function(scope, element, attrs){
	      // Obviously this needs to be hidden better (probably a z-index, and positioned behind something opaque)
	      element.css('height', '0px');
	      element.css('width', '0px');
	      element.css('resize', 'none');
//	      element.css('visibility', 'hidden'); 
	    }
	  };
	});
// 셀카피 끝