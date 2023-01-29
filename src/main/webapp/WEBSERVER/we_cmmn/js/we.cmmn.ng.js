/**
 * angular js - 모듈생성 관련 utilities
 *	- 모듈생성
 *	- 기본 directive, filter, config, factory 
 *
 * @author	염국선
 * @since	2022.01.20
 */
class NgUtil extends DataUtil {
	
	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//UI - 다중선택콤보 등
	ngUiSelection; 
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	
		
		
	//=========================================================================
	// 생성자
	//-------------------------------------------------------------------------
	constructor(settings) {
		super({name:"NgUtil", debug:true});
		this._settings = this.extend(this._settings, settings);
 		this._debug("constructor_settings:"+JSON.stringify(this._settings));
 		//NgUiSelection 생성
 		this.ngUiSelection = new NgUiSelection({name:"NgUiSelection", CELL_COMBO_HEIGHT:this._settings.CELL_COMBO_HEIGHT, debug:this._settings.debug});
	}//end-constructor(settings) {
	//-------------------------------------------------------------------------
	// //생성자
	//=========================================================================
	
		
		
		
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------
	//#########################################################################
	// module
	//.........................................................................
	///////////////////////////////////////////////////////
	// basic module instance
	//	instanceBasicModule("mstApp", ["ui.grid.grouping", "ui.grid.rowEdit"]);
	//-----------------------------------------------------
	instanceBasicModule = (name, options) => {
		this._debug("instanceBasicModule");
		const app = angular.module(name, this.getModuleConfigs(options));
		
		//-------- 기본 directive 추가 -------------
		//ngEnter directive 추가
		this.addNgEnterDirective(app);
		//한글입력필드 directive
		this.addKrInputDirective(app);
		//한글입력셀 directive
		this.addKrCellDirective(app);
		//drag & drop을 이용한 배열 재정렬 
		this.ngUiSelection.addSortableDragDirective(app);
		//숫자입력필드 directive
		this.addNumberOnlyDirective(app);
		//숫자포맷입력필드 directive
 		this.addNumberFormatDirective(app);
		//라벨 마스크처리
		this.addLabelMaskDirective(app);
		//수정이벤트 directive
		this.addCustomOnChangeDirective(app);
		//다중선택콤보
		this.ngUiSelection.addMultiComboDirective(app);

		//-------- 기본 filter 추가 -------------
		//code name filter 추가
		this.addCodeNameFilter(app);
		//data render filter 추가
		this.addDataRenderFilter(app);
		//empty label filter 추가
		this.addEmptyLabelFilter(app);
		//한글숫자 filter추가
		this.addKorNumFilter(app);
		
		//-------- 기본 config 추가 -------------
		//$qProvider configuration
		this.addQProviderConfig(app);

		//-------- 기본 factory 추가 -------------
		
		return app;
	}//end-instanceBasicModule
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// basic config + add config return
	//-----------------------------------------------------
	//기본: ui-grid-resize-columns ui-grid-move-columns ui-grid-exporter ui-grid-selection ui-grid-auto-resize
	//기타: ui-grid-grouping ui-grid-edit ui-grid-row-edit ui-grid-cellnav ui-grid-expandable ui-grid-selectable
	//-----------------------------------------------------
	getModuleConfigs = (options) => {
		this._debug("getModuleConfigs");
		const configs = [
			"ui.grid",
			"ui.grid.cellNav",			//그리드 선택 표시-ui-grid-cellnav
			"ui.grid.selection",		//row 선택-ui-grid-selection
			"ui.grid.resizeColumns",	//컬럼 resize-ui-grid-resize-columns
			"ui.grid.moveColumns",		//컬럼순서이동-ui-grid-move-columns
			"ui.grid.autoResize",
			"ui.grid.exporter",			//excel/pdf-ui-grid-exporter
			"checklist-model",			//checkbox selection
			"ui.calendar",				//calendar
			"moment-picker",			//date picker
			"blockUI"
			
			//"ui.grid.expandable"		//ui-grid-expandable
			//"ui.grid.edit",				//ui-grid-edit
			//"ui.grid.rowEdit",			//ui-grid-row-edit
			//"ui.grid.saveState",
			//"ui.grid.pinning",
			//"ui.grid.infiniteScroll",
			//"ui.grid.importer",
			//"ui.grid.grouping",
			//"ui.grid.pagination",
			//"ngUpload",
			//"pascalprecht.translate"	// 다중언어 적용
			//"ui.select", "ngSanitize"	//search combo
		];

		//추가옵션 미존재시 추가 
		options = options||[];
		for (let i=0; i<options.length; i++) {
			let exist = false;
			for (let j=0; j<configs.length; j++) {
				if (configs[j] === options[i]) {
					exist = true;
					break;
				}
			}
			if (!exist) {
				configs.push(options[i]);
			}
		}

		this._debug("module configuration:"+JSON.stringify(configs));
		
		return configs;
	}//end-instanceModuleConfigs
	///////////////////////////////////////////////////////
	//.........................................................................
	// module
	//#########################################################################

	
	//#########################################################################
	// directive
	//.........................................................................
	///////////////////////////////////////////////////////
	// customOnChange directive
	//-----------------------------------------------------
	addCustomOnChangeDirective = (app) => {
		this._debug("addCustomOnChangeDirective");
		app.directive("customOnChange", () => {
			return {
				restrict	: "A",
				link		: (scope, element, attrs) => {
					const onChangeHandler = scope.$eval(attrs.customOnChange);
					element.on('change', onChangeHandler);
					element.on('$destroy', () => {
						element.off();
					});
				}
			}
		});
	}//end-addCustomOnChangeDirective
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// form label masking
	//-----------------------------------------------------
	addLabelMaskDirective = (app) => {
		this._debug("addLabelMaskDirective");
		app.directive("labelMask", () => {
			return {
				scope	: false,
				compile	: (el, attr) => {
					let maskType = el.attr("label-mask")||"required";
					if (maskType === "required") {
						el.append('<em style="color: red">*</em>');
					}
				}
			}
		});		
	}//end-addLabelMaskDirective
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 한글입력 cell directive
	//-----------------------------------------------------
	addKrCellDirective = (app) => {
		this._debug("addKrInputDirective");
		app.directive("krCell", () => {
			return (scope, element, attrs) => {
				element.on("compositionstart", (e) => {
					this._debug("krCell.compositionstart - "+attrs.ngModel);
					e.stopImmediatePropagation();
				});
				element.bind("keypress", (e) => {
					if (event.which === 13) {
						const modelVal = this.getWithPath(scope, attrs.ngModel);
						this._debug("krCell.enter - "+attrs.ngModel+" -> model:"+modelVal+", el:"+e.target.value);
						scope.$apply(() => {
							this.setWithPath(scope, attrs.ngModel, e.target.value);
						});
					}
				});
				element.on("blur", (e) => {
					const modelVal = this.getWithPath(scope, attrs.ngModel);
					this._debug("krCell.blur - "+attrs.ngModel+" -> model:"+modelVal+", el:"+e.target.value);
					scope.$apply(() => {
						this.setWithPath(scope, attrs.ngModel, e.target.value);
					});
				});
			}
		});
	}//end-addKrCellDirective
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 한글입력 input directive
	//-----------------------------------------------------
	addKrInputDirective = (app) => {
		this._debug("addKrInputDirective");
		app.directive("krInput", ($parse) => {
			return {
				priority : 2,
				restrict : "A",
				compile : (element) => {
					element.on("compositionstart", (e) => {
						//console.log("krInput stop propagantion")
						e.stopImmediatePropagation();
					});
				}
			}}
		);
	}//end-addKrInputDirective
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 숫자입력포맷 (<input number-format model="ds_mst.AMT" digit="4" sign="true" change="lfn_mst_onChange('AMT')" class="form-control" type="text">)
	//	- model:ng-model
	//	- digit:소숫점자리수
	//	- sign:true/false
	//-----------------------------------------------------
	addNumberFormatDirective = (app) => {
		this._debug("addNumberFormatDirective");
		app.directive("numberFormat", ($injector, $timeout, $filter) => {
			//model 명으로 $scope객체 및 이름 설정
			let _parseModel = (scope, model) => {
				const data = {obj:"scope", name:model, path:model}
				const names = model.split("\.");
				if (names.length > 1) {
					data.name = names.pop();
					data.obj = "scope."+names.join("\.");
				}
				return data;
			}
			
			//설정된 옵션 분석
			const _parseOpts = (el) => {
				const opts = {digit:0, sign:true}
				opts.digit = !el.attr("digit") ? 5 : parseInt(el.attr("digit"));
				opts.sign = el.attr("sign") !== "false";
				opts.change = el.attr("change");
				return opts;
			}
			
			//입력진행 중인 값에 대해 숫자반환
			const _toNum = (val) => {
				if (!val && val !== 0) {
					return null;
				}
				val = val.toString().replace(/,/gi, "");
				if (val.substring(val.length-1, val.length) === ".") {
					val = val.substring(0, val.length-1)
				}
				return parseFloat(val);
			}
			
			//number formatting
			const _format = (val, opts) => {
				const type = typeof(val);
				let formatStr = "";
				
				if (type === "string") {
					if (val.length > 0) {
						const dotPos = val.indexOf(".");
						if (dotPos === -1) {
							formatStr = parseInt(val).toLocaleString( undefined, {maximumFractionDigits: 0});
						} else {
							formatStr = parseInt(val.substring(0, dotPos)).toLocaleString( undefined, {maximumFractionDigits: 0}) 
											+ "." + val.substring(dotPos+1, dotPos+1+opts.digit);
							//console.log("head/dot/tail:"+val.substring(0, dotPos)+"/./"+val.substring(dotPos+1, dotPos+1+opts.digit)+'/src:'+val);
						}
					}
					
				} else if (type === "number") {
					formatStr = val.toLocaleString( undefined, {maximumFractionDigits: opts.digit});

				} else {
					formatStr = "";
				}
				
				//console.log("format:"+formatStr);
				return formatStr;
			}
			
			return {
				scope	: false,
				link	: (scope, el, attrs) => {
					const data = _parseModel(scope, el.attr("model"));
					const opts = _parseOpts(el);
					
					scope.$watch(data.path, (newValue, oldValue) => {
						//console.log("watch newValue:"+newValue+", elValue:"+el.val());
						if (newValue) {
							if (typeof(newValue) !== "number") {
								newValue = parseFloat(newValue);
							}
							const elValue = _toNum(el.val());
							if (newValue !== elValue) {
								//console.log("#####not wq newValue:"+newValue+", elValue:"+elValue);
								el.val(_format(newValue, opts))
							}
						} else {
							if (el.val() !== "-") {
								el.val(newValue===0?"0":"");
							}
						}
					})
					
					//입력처리
					el.bind("input", () => {
						let val = el.val();
						//console.log("input:"+val+","+opts.sign+","+opts.digit);
						//부호확인
						let sign = "";
						if (val.substring(0,1) === "-") {
							if (opts.sign) {
								sign = "-"
							}
							val = val.substring(1);
						}
						//첫번째 dot 않됨
						if (val.substring(0,1) === ".") {
							val = val.substring(1);
						}
						//console.log("sign:"+sign+", val:"+val);
						
						//소숫점 자릿수 확인
						if (opts.digit === 0) {
							val = val.replace(/[^0-9]+/g, "");
						} else {
							val = val.replace(/[^0-9\.]+/g, "");
							const dotPos = val.indexOf("\.");
							if (val.substring(val.length-1,val.length) === "." && dotPos !== val.length-1) {
								val = val.substring(0, val.length-1)
							}
							//소숫점자리수 초과시 무시
							if (dotPos > 0 && val.length - dotPos - 1 > opts.digit) {
								val = val.substring(0, dotPos + opts.digit + 1);
							}
						}
						
						//console.log("result sign:"+sign+", val:"+val);
						if (val.length > 3) {
							el.val(_format(sign + val, opts));
						} else {
							el.val(sign + val);
						}
						
						//console.log(data.obj+"."+data.name+" = "+_toNum(val))
						eval(data.obj+"."+data.name+" = "+_toNum(sign + val));
						if (opts.change) {
							eval("scope."+opts.change);
						}
						scope.$apply();
					});
				}
			}
		});
	}//end-addNumberFormatDirective
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// 숫자만 입력 가능  (소수점은 입력 가능)
	//-----------------------------------------------------
	addNumberOnlyDirective = (app) => {
		this._debug("addNumberOnlyDirective");
		app.directive("numbersOnly", () => {
			return {
				require: "ngModel",
				link: (scope, element, attr, ngModelCtrl) => {
					const changeNumber = (text) => {
						//console.log("numbersOnly");
						if (text) {
							const transformedInput = text.replace(/[^0-9-.]/g, '');
							if (transformedInput !== text) {
								ngModelCtrl.$setViewValue(transformedInput);
								ngModelCtrl.$render();
							}
							return transformedInput;
						}
						return undefined;
					}
					ngModelCtrl.$parsers.push(changeNumber);
				}
			};
		});
	}//end-addNumberOnlyDirective
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// enter directive 추가
	//-----------------------------------------------------
	addNgEnterDirective = (app) => {
		this._debug("addNgEnterDirective");
		app.directive("ngEnter", () => {
			return (scope, element, attrs) => {
				element.bind("keydown keypress", (event) => {
					if (event.which === 13) {
						this._debug("ngEnter");
						scope.$apply(() => {
							scope.$eval(attrs.ngEnter);
						});
						event.preventDefault();
					}
				});
			};
		});
	}//end-addNgEnterDirective
	///////////////////////////////////////////////////////
	//.........................................................................
	// directive
	//#########################################################################


	//#########################################################################
	// filter
	//.........................................................................
	///////////////////////////////////////////////////////
	// code name filter 추가
	//	- cellFilter: "codeName:grid.appScope.ds_code.TASK_CD"
	//	- cellFilter: "codeName:grid.appScope.ds_code.CO_CD:CO_CD:CO_NM"
	//-----------------------------------------------------
	addCodeNameFilter = (app) => {
		this._debug("addCodeNameFilter");
		app.filter("codeName", () => {
			return (codeVal, codeList, codeField, nameField) => {
 				const names = [];
				if (codeVal) {
					const values = codeVal.split(",");
					for (let i=0; i<values.length; i++) {
 						names.push(this.getCodeName(codeList, values[i], codeField, nameField));
					}
					return names.join(",");
				}
 				return "";
			} 
		});
	}//addCodeNameFilter
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// render filter 추가
	//-----------------------------------------------------
	//	cellFilter: 'dataRender:"lfn_cell_format":col.colDef.field:row.entity:grid'
	//	//cell format
	//	scope.lfn_cell_format = function (name, entity, grid) {
	//		if (XUTL.isIn(name, "PRC", "AM", "QTY")) {
	//			let digit = 0;
	//			if (true) { // 조건
	//				digit = 3
	//			}
	//			return XUTL.toNum(entity[name]).toLocaleString( undefined, {minimumFractionDigits: digit});
	//		}
	//		return entity[name]
	//	}	
	//-----------------------------------------------------
	addDataRenderFilter = (app) => {
		this._debug("addDataRenderFilter");
		app.filter("dataRender", () => {
			return (val, fn, field, entity, grid) => {
				if (typeof(fn) === "function") {
					try {
						return fn(field, entity, grid);
					} catch(e) {
						return val;
					}
				} else if (typeof(fn) === "string") {
					try {
						return this.getWithPath(grid.appScope, fn)(field, entity, grid);
					} catch(e) {
						return val;
					}
				} else {
					return val;
				}
			};
		});
	}//addDataRenderFilter
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// empty label filter 추가
	//	- cellFilter: 'emptyLabel:"등록"'
	//-----------------------------------------------------
	addEmptyLabelFilter = (app) => {
		this._debug("addEmptyLabelFilter");
		app.filter("emptyLabel", () => {
			return (val, label) => {
				if (!val) {
					return label;
				}
				return val;
			};
		});
	}//addEmptyLabelFilter
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// 한글 숫자 filter 추가
	//-----------------------------------------------------
	addKorNumFilter = (app) => {
		this._debug("addKorNumFilter");
		app.filter("korNum", () => {
			return this.toKorNum;
		});
	}//end-addKorNumFilter
	///////////////////////////////////////////////////////
	//.........................................................................
	// filter
	//#########################################################################


	//#########################################################################
	// config
	//.........................................................................
	///////////////////////////////////////////////////////
	// $qProvider
	//-----------------------------------------------------
	addQProviderConfig = (app) => {
		this._debug("addQProviderConfig");
		app.config(['$qProvider', ($qProvider) => {
			$qProvider.errorOnUnhandledRejections(false);
		}]);
	}//end-addQProviderConfig
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 다중언어 적용
	//-----------------------------------------------------
	addTranslateProviderConfig = (app) => {
		this._debug("addTranslateProviderConfig");
		app.config(["$translateProvider", ($translateProvider) => {
			let dd = JSON.parse(sessionStorage.getItem('DD_KR'));
			$translateProvider.translations('KR', dd);
			dd = JSON.parse(sessionStorage.getItem('DD_JP'));
			$translateProvider.translations('JP', dd);
		}]);
	}//end-addTranslateProviderConfig
	///////////////////////////////////////////////////////
	//.........................................................................
	// config
	//#########################################################################
	//-------------------------------------------------------------------------
	// //public 메서드
	//=========================================================================

	
		
		
	//=========================================================================
	// private 메서드
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================

}//class NgUtil




/**
 * angular js - 데이터 선택 관련 모듬
 *	- 다중선택콤보 
 *
 * @author	염국선
 * @since	2022.01.20
 */
class NgUiSelection extends DataUtil {
	
	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	
		
		
	//=========================================================================
	// 생성자
	//-------------------------------------------------------------------------
	constructor(settings) {
		super({name:"NgUiSelection", debug:true});
		this._settings = this.extend(this._settings, settings);
 		this._debug("constructor_settings:"+JSON.stringify(this._settings));
	}//end-constructor(settings) {
	//-------------------------------------------------------------------------
	// //생성자
	//=========================================================================
	
		
		
		
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------
	///////////////////////////////////////////////////////
	// 코드데이터 다중선택 콤보
	//-----------------------------------------------------
	//	jsp
	//		<link href="/WEBSERVER/we_std/css/std_cmmn.css" rel="stylesheet">
	//		<div class="ibox-content row" style="overflow:visible;">
	//			...
	//			<label class="col-sm-1 control-label">창고</label>
	//			<div class="col-sm-1">
	//				<multicombo multi-combo sel-model="ds_cond.WH_CDS" list-model="ds_code.WH_CD" change="lfn_change" init-all="true"></multicombo>
	//			</div>
	//	grid 
	//		cellTemplate: multiCombo}
	//		- 그리드의 경우 신규레코드 생성시 마지막레코드에 추가하지 않으면 row 값의 레퍼런스가 올바르게 넘어 오지 않음 
	//		- 따라서 unshift로 첫번쟤 레코드에 추가 할경우 전체 레코드 삭제 후 다시 작성
	//		const list = XUTL.addRows([], $scope.mstGrid.data);
	//		list.unshift({ROW_CRUD	: "C"});
	//		XUTL.empty($scope.mstGrid.data);
	//		$timeout(() => {
	//    		XUTL.addRows($scope.mstGrid.data, list);
	//    		NG_GRD.selectRow($scope.mstGrid.gridApi, "first");
	//		});
	//-----------------------------------------------------
	addMultiComboDirective = (app) => {
		this._debug("addMultiComboDirective");
		app.directive("multiCombo", ($compile, $timeout, blockUI) => {
			const template
				= '<div class="input-group"  style="width: 100%;">'
				+ ' <div style="display:inherit" class="ng-isolate-scope">'
				+ '  <input class="form-control multsel-text" readonly title="">'
				+ '  <span class="input-group-addon ng-scope toggle"><i class="fa fa-chevron-down"></i></span>'
				+ ' </div>'
				+ ' <div class="dropdown close">'
				+ '  <ul class="dropdown-menu">'
//				+ '   <li class="ng-scope"><input type="checkbox"> aaaa</input></li>'
				+ '  </ul>'
				+ ' </div>'
				+ '</div>';

			return {
				scope		: false,
				template	: template,
				compile		: (el, attrs) => {
					return {
				        pre: (scope, el, attrs, controller) => {
				        	const selModelName		= scope.grid && scope.row 
				        								? el.attr("sel-model").replace(/'\]\['/g, ".").replace(/\['/g, ".").replace(/'\]/g, "") 
				        								: el.attr("sel-model");
				        	const listModelName		= el.attr("list-model");
				        	const ngDisabledName	= el.attr("ng-disabled");
				        	const change			= el.attr("change");
				        	this._debug("multiCombo pre compile - sel-model:"+selModelName+", list-model:"+listModelName+", ng-disabled:"+ngDisabledName+", scope.grid:"+scope.grid);
				        	

				        	//선택된 코드목록 반환
				        	const getSelection = () => {
				        		const selection = [];
				        		const $dropdown = $("ul.dropdown-menu", el);
				        		const $chkBoxes = $dropdown.find("input:checkbox");
								for (let i=0; i<$chkBoxes.length; i++) {
									if ($chkBoxes.eq(i).is(":checked")) {
										selection.push($chkBoxes.eq(i).val());
									}
								}
					        	this._debug("multiCombo.getSelection - selection:"+selection);
					        	
								return selection;
				        	}//end-const getSelection
				        	
				        	//값 설정
				        	const setModelValue = (selection) => {
				        		const selModel = this.getWithPath(scope, selModelName);
					        	if (Array.isArray(selModel)) {
				        			selModel.splice(0);
				        			this.addRows(selModel, selection);
				        		} else {
				        			this.setWithPath(scope, selModelName, selection.join(","));
				        		}
				        	}//end-const setModelValue
				        		
				        	//데이터 변경시 적용
				        	scope.$watch(selModelName, (newValue, oldValue) => {
					        	this._debug("multiCombo.$watch - model:"+selModelName+", newValue:"+newValue);
								newValue = newValue||"";
								const selection = newValue.split(",");
					        	applyTitle(selection, this.getWithPath(scope, listModelName));
					        	applySelection(selection);
							})
							
				        	//타이틀 작성
				        	const applyTitle = (selection, codeList) => {
								let title = "전체";
								if (selection.length < codeList.length) {	//일부선택
									const names = this.getValueMatrix(this.findRows(codeList, "CODE_CD", selection), "CODE_NM")[0]; 
									title = names.join(",");
								}
								el.find("input.multsel-text").val(title).attr("title", title);
				        	}//end-const applyTitle
				        		
				        	//선택된 목록 적용
				        	const applySelection = (selection) => {
				        		$("div.dropdown", el).find('input:checkbox').attr("checked", false);
								for (let i=0; i<selection.length; i++) {
				        			$("div.dropdown", el).find('input:checkbox[value="'+selection[i]+'"]').attr("checked", true);
								}
				        	}//end-const applySelection
				        	
							//선택목록 작성
							const selectionHtml
								= '<li class="li-btn" ' + (ngDisabledName ? 'ng-show="!('+ngDisabledName+')" ' : '') + '>'
								+ '<p><a class="selall"><i class="fa fa-check"></i>전체선택</a><a class="selcancel"><i class="fa fa-times"></i>선택취소</a></p>'
								+ '</li>'
								+ '<li ng-repeat="x in ' + listModelName + '" class="ng-scope li-item">'
								+ '<input value="{{x.CODE_CD}}" ' + (ngDisabledName ? 'ng-disabled="'+ngDisabledName+'" ' : '') + 'type="checkbox" id="{{x.CODE_CD}}" />'
								+ '<label for="{{x.CODE_CD}}">{{x.CODE_NM}}</label></li>'
								;
							el.find("ul.dropdown-menu").append($compile(selectionHtml)(scope));

							//토글버튼 클릭시 토글처리
							$(".toggle", el).click(() => {
								const $dropdown = $("div.dropdown", el);
								if ($dropdown.hasClass("open")) {
									$dropdown.removeClass("open");
									$dropdown.addClass("close");
								} else {
									//전체선택/전체취소 이벤트 설정
									$dropdown.find("a").off("click").click((e) => {
										if ($(e.target).hasClass("selall")) {
											$dropdown.find("input:checkbox").attr("checked", true);
										} else if ($(e.target).hasClass("selcancel")) {
											$dropdown.find("input:checkbox").attr("checked", false);
										}
										$timeout(() => {
											const selection = getSelection();
								        	applyTitle(selection, this.getWithPath(scope, listModelName));
								        	setModelValue(selection);
								        	if (change) {
								        		eval("scope."+change);
								        	}
										});
									});
									//체크박스 이벤트 설정
									$dropdown.find("input:checkbox").off("change").change(() => {
										$timeout(() => {
											const selection = getSelection();
								        	applyTitle(selection, this.getWithPath(scope, listModelName));
								        	setModelValue(selection);
								        	if (change) {
								        		eval("scope."+change);
								        	}
										});
									});
									
									$dropdown.removeClass("close");
									$dropdown.addClass("open");
								}
								
							});//$(".toggle", el).click(() => {

				        	//선택박스에서 마우스 벗어나면 close
				        	$("div.dropdown", el).mouseleave((e) => {
								$("div.dropdown", el).removeClass("open").addClass("close");
				        	});
							
				        	//dropdown menu 노출
				        	if (scope.grid) {
					        	$(el).parents(".ui-grid-cell").css("overflow", "visible");
					        	$(el).parent().removeClass("ui-grid-cell-contents");
					        	if (this._settings.CELL_COMBO_HEIGHT) {
									$(el).find("input").css("height", this._settings.CELL_COMBO_HEIGHT);
									$(el).find("span.toggle").css("height", this._settings.CELL_COMBO_HEIGHT);
					        	}
				        	}
				        	
				        	//초기선택 설정
				        	$timeout(() => {
				        		const selection = [];
					        	if (el.attr("init-all") === "true") {	//초기 전체 선택
					        		this.addRows(selection, this.getValueMatrix(this.getWithPath(scope, listModelName), "CODE_CD")[0]);
					        	} else {
						        	const selValue = this.getWithPath(scope, selModelName);
					        		if (Array.isArray(selValue)) {
						        		this.addRows(selection, selValue);
					        		} else if (selValue && typeof(selValue) === "string") {
						        		this.addRows(selection, selValue.split(","));
					        		}
					        	}
					        	applyTitle(selection, this.getWithPath(scope, listModelName));
								applySelection(selection);
				        	});
				        	
				        },//end-pre:
				        post: (scope, el, attrs, controller) => {}
					}
				}
			}//end-return {
		});		
	}//end-addMultiComboDirective
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// sortableDrag directive
	//-----------------------------------------------------
	//	<div sortable-drag item="drop" model="list" class="col-sm-12 form-group">
	//		<div ng-repeat="item in list" sortable-drag item="drag" class="col-sm-2" style="height:100px; border:1px solid;">
	//			{{item.NM}}
	//		</div>
	//	</div>
	//-----------------------------------------------------
	addSortableDragDirective = (app) => {
		this._debug("addSortableDragDirective");
		app.directive("sortableDrag", () => {
			return {
				scope	: false,
				link	: (scope, el, attr, ctrl) => {
					const item = el.attr("item");
					
					if (item === "drop") {
						//dragover event bind
						el.on("dragover", (event) => {
							if (event) {
								event.preventDefault();
								event.stopPropagation();
								event.originalEvent.dataTransfer.dropEffect = "move";
							}
						});
						//drop event bind
						el.on("drop", (event) => {
							if (event && event.preventDefault) { 
								event.preventDefault();
							}

							const list	= eval("scope." + el.attr("model"));
							const srcIdx	= parseInt(event.originalEvent.dataTransfer.getData("text"));
							const srcData = list[srcIdx];
							let tgtData;
							const $target = $(event.target);
							
							if ($target.attr("item") === "drag") { //target이 drag item 일 경우
								tgtData = list[$target.index()-$target.parent().find("[item=drag]").eq(0).index()]; //item=drag가 아닌 항목제외
							} else {
								const $drag = $target.closest("[item=drag]");
								if ($drag.length === 1) {	//target의 상위가 drag item인 경우
									tgtData = list[$drag.index()-$drag.parent().find("[item=drag]").eq(0).index()]; //item=drag가 아닌 항목제외
								}
							}
							
							if (srcData !== tgtData) {
								scope.$apply(() => {
									if (tgtData) {
										if (tgtData.sortable !== false && tgtData.sortable !== "false") {
											list.splice(list.indexOf(srcData), 1);
											list.splice(list.indexOf(tgtData), 0, srcData);
											if (el.attr("change")) {
												const change = eval("scope." + el.attr("change"));
												change(tgtData, list);
											}
										}

									} else {
										list.splice(list.indexOf(srcData), 1);
										list.push(srcData);
										if (el.attr("change")) {
											const change = eval("scope." + el.attr("change"));
											change(tgtData);
										}
									}
								});//end-scope.$apply(() => {
							}//end-if (srcData !== tgtData) {
								
						});//end-el.on("drop", (event) => {
					}//end-if (item === "drop") {
						
					if (item === "drag") {
						const list = eval("scope." + el.attr("list"));
						const data = eval("scope." + el.attr("model"));
						if (data.sortable !== false && data.sortable !== "false") {
							el.attr("draggable", "true");
							//dragstart event bind
							el.on("dragstart", (event) => {
								event.originalEvent.dataTransfer.setData("text", list.indexOf(data)+"");
							});
						} else {
							if (event && event.preventDefault) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}//end-if (item === "drag") {
	
				}//end-link	: (scope, el, attr, ctrl) => {
			}//end-return {
		});		
	}//end-addSortableDragDirective
	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //public 메서드
	//=========================================================================

	
		
		
	//=========================================================================
	// private 메서드
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================

}//class NgUiSelection




/**
 * angular js - ui - 참부 directive관련 
 * 
 * @author	염국선
 * @since	2022.01.05
 */
class NgUiAtch extends FileUtil {
	
	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//ui template set
	_templateSet = {};
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	
		
		
	//=========================================================================
	// 생성자
	//-------------------------------------------------------------------------
	constructor(settings) {
		super({
			name				: "NgUiAtch",
			URL_FILE_LIST		: "/std/cmmn/fl/selFileList.do",
			URL_FILE_UPLOAD		: "/std/cmmn/fl/upload.do",
			URL_FILE_DOWNLOAD	: "/std/cmmn/fl/download.do",
			URL_FILE_DELETE		: "/std/cmmn/fl/removeFile.do",
			debug				: true
		});
		
		this._settings = this.extend(this._settings, settings);
 		this._debug("constructor_settings:"+JSON.stringify(this._settings));
 		this._init();
	}//end-constructor(settings) {
	//-------------------------------------------------------------------------
	// //생성자
	//=========================================================================
	
		
		
		
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------
	///////////////////////////////////////////////////////
	// template 설정(기존템플릿과 다른 설정을 위해)
	//-----------------------------------------------------
	setTemplate = (name, html) => {
 		this._debug("setTemplate:"+name);
		this._templateSet[name] = html;
	}//end-setTemplate
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// file download
	//-----------------------------------------------------
	downloadFile = (fileId) => {
 		this._debug("downloadFiledownloadFile:"+fileId);
		this.download(this._settings.URL_FILE_DOWNLOAD, {FILE_ID:fileId});
	}//end-downloadFile
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 첨보파일 목록 directive 추가
	//-----------------------------------------------------
    // js:
	// 	NG_ATCH.addAtchListDirective(app);
	//$scope.ds_at	= {
	//		config	: {
	// 			FILE_BINDER_ID: null,
	// 			data		: {FILE_BINDER_GB: "NOTICE"},	//FILE_BINDER_VALID:"N" -> ID지정시
	//			editable	: true,
	//			mutiple		: true,
	//			placeholder	: "(첨부파일: 준공사진, 공사별 정산내역서, 하자이행증권 등)",
	//			onAdd		: (list) => {
	//				$scope.ds_mst.MAIL_AT = $scope.ds_at.config.FILE_BINDER_ID;
	//			},
	//			onDel		: (fl) => {
	//				if ($scope.ds_at.data.length === 0) {
	//					$scope.ds_mst.MAIL_AT = "";
	//				}
	//			},
	//			onLoad		: {list} => {}
	//			upload_limit_one: 3,	//한번첨부시 제한
	//			upload_limit_all: 20,	//전체첨부 수
	//			DISPLAY_DEL		: "switch",	//hide
	//			DISPLAY_ADD		: "switch",	//show(항상 추가버튼이 보임)/hide
	//		}
	//	};
    //....
    //$scope.ds_at.api.load();
	//
    // jsp: <div attach-list="ds_at"></div>
    // jsp: <div attach-list="ds_at" template="input"></div> 
    // jsp: <div attach-list="ds_at" template="table"></div>
	// jsp: <div attach-list="ds_at" template="view" style="max-height:100px; border:1px solid #6A92BD; padding:10px; line-height:120%; overflow-y:auto"></div>
    // jsp:
	//<div style="height:100px; overflow:auto;">
	// <div atch-list="ds_at" template="view" style="width:90%; float:left;"></div>
	// <button ng-click="ds_at.api.upload()"	ng-disalbed="!(ds_at.config.editable===true)"	ng-show="ds_at.config.editable===true" class="btn btn-warning btn-tbb"  style="position:absolute; top:50%; right:5%; transform:translateY(-50%);" type="button">추가</button>
	//</div>	
	//-----------------------------------------------------
	addAttachListDirective = (app) => {
		this._debug("addAttachListDirective");
		this._buildAttachDirective(app, "attachList", "attach-list");
	}//end-addAttachListDirective
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// 첨보파일 모달 directive 추가
	//-----------------------------------------------------
    // js:
	// 	NG_ATCH.addAtchModalDirective(app);
	//$scope.ds_at	= {
	//		config	: {
	// 			FILE_BINDER_ID: null,
	// 			data		: {FILE_BINDER_GB: "NOTICE"},
	//			editable	: true,
	//			mutiple		: true,
	//			placeholder	: "(첨부파일: 준공사진, 공사별 정산내역서, 하자이행증권 등)",
	//			onAdd		: (list) => {
	//				$scope.ds_mst.MAIL_AT = $scope.ds_at.config.FILE_BINDER_ID;
	//			},
	//			onDel		: (fl) => {
	//				if ($scope.ds_at.data.length === 0) {
	//					$scope.ds_mst.MAIL_AT = "";
	//				}
	//			},
	//			onLoad		: {list} => {}
	//			upload_limit_one: 3,	//한번첨부시 제한
	//			upload_limit_all: 20,	//전체첨부 수
	//			DISPLAY_DEL		: "switch",	//hide
	//			DISPLAY_ADD		: "switch",	//show(항상 추가버튼이 보임)/hide
	//		}
	//	};
    //....
	//$scope.ds_at.api.modal();
	//
    // jsp: <div attach-modal="ds_at" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="fileModalLabel" aria-hidden="true">
	//-----------------------------------------------------
	addAttachModalDirective = (app) => {
		this._debug("addAttachModalDirective");
		this._buildAttachDirective(app, "attachModal", "attach-modal");
	}//end-addAttachModalDirective
	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //public 메서드
	//=========================================================================

	
		
		
	//=========================================================================
	// private 메서드
	//-------------------------------------------------------------------------
	///////////////////////////////////////////////////////
	// initialize
	//-----------------------------------------------------
	_init = () => {
		//upload ng-if
		const ngIfAdd = "XXX.config.DISPLAY_ADD !== \'hide\' && (XXX.config.DISPLAY_ADD === \'show\' || XXX.config.editable)";
		//delete ng-if
		const ngIfDel = "XXX.config.DISPLAY_DEL !== \'hide\' && XXX.config.editable";
		
		//와곽라인 없음(view + add button)
		this._templateSet.normal
			= '<table style="width:100%; height:100%">'
			+ ' <tr valign="top">'
			+ '  <td class="align_lft" style="width:70%;">'
			+ '   <table style="width:100%">'
			+ '    <tr ng-if="XXX.config.editable">'
			+ '     <td class="align_lft" style="border:0;">{{XXX.config.placeholder}}</td>'
			+ '    </tr>'
			+ '    <tr ng-repeat="x in XXX.data" valign="top" style="height:1.5em;">'
			+ '     <td class="align_lft" style="border:0;">'
			+ '      <a ng-click="XXX.api.download(x.FILE_ID)" class="attch_file_name">{{x.ORIGNL_FILE_NM}}</a>'
			+ '      <spna ng-if="'+ngIfDel+'">&nbsp;&nbsp;&nbsp;<a ng-click="XXX.api.removeFile(x.FILE_ID)"><i class="fa fa-close" title="삭제"></i></a><span>'
			+ '     </td>'
			+ '    </tr>'
			+ '   </table>'
			+ '  <td>'
			+ '  <td ng-if="'+ngIfAdd+'" class="align_rgt" style="width:30%;">'
			+ '   <table style="width:100%; height:100%">'
			+ '    <tr>'
			+ '     <td class="align_rgt" style="border:0; padding:3px;"><button ng-click="XXX.api.upload()" ng-disabled="!XXX.config.editable" class="btn btn-warning btn-tbb file-upload" type="button">추가</button></td>'
			+ '   </tr>'
			+ '   </table>'
			+ '  <td>'
			+ ' </tr>'
			+ '</table>'
			;
			
		//input 형태(view + add button)
		this._templateSet.input
			= '<table style="width:100%; height:100%">'
			+ ' <tr valign="top">'
			+ '  <td class="align_lft" style="width:90%;border:0;">'
			+ '   <table style="width:100%;">'
			+ '    <tr ng-if="XXX.config.placeholder" style="border:0;">'
			+ '     <td class="align_lft" style="border:0;">{{XXX.config.placeholder}}</td>'
			+ '    </tr>'
			+ '    <tr  valign="top" style="border:1px solid #6A92BD;height:25px">'
			+ '     <td class="align_lft" style="border:0;">'
			+ '      <div ng-repeat="x in XXX.data" style="padding-left:2px;">'
			+ '       <a ng-click="XXX.api.download(x.FILE_ID)" class="attch_file_name">{{x.ORIGNL_FILE_NM}}</a>'
			+ '       <spna ng-if="'+ngIfDel+'">&nbsp;&nbsp;&nbsp;<a ng-click="XXX.api.removeFile(x.FILE_ID)"><i class="fa fa-close" title="삭제"></i></a><span>'
			+ '      </div>'
			+ '     </td>'
			+ '    </tr>'
			+ '   </table>'
			+ '  </td>'
			+ '  <td ng-if="'+ngIfAdd+'" class="align_rgt" style="width:10%;border:0;">'
			+ '   <table style="width:100%; height:100%">'
			+ '    <tr>'
			+ '     <td class="align_rgt" style="border:0; padding:3px;"><button ng-click="XXX.api.upload()" ng-disabled="!XXX.config.editable" class="btn btn-warning btn-tbb file-upload" type="button">추가</button></td>'
			+ '   </tr>'
			+ '   </table>'
			+ '  </td>'
			+ ' </tr>'
			+ '</table>'
			;

		//table 형태(list + add button)
		this._templateSet.table
			= '<table ng-if="'+ngIfAdd+'" style="width:100%; border:0">'
			+ ' <tr>'
			+ '  <td class="align_lft"><span>{{XXX.config.placeholder}}</span></td>'
			+ '  <td class="align_rgt"><button ng-click="XXX.api.upload()" ng-disabled="!XXX.config.editable" class="btn btn-warning btn-tbb file-upload" type="button">추가</button></td>'
			+ ' </tr>'
			+ '</table>'
			+ '<table class="table table-bordered">'
			+ ' <colgroup>'
			+ '  <col width="150px" />'
			+ '  <col width="*" />'
			+ '  <col ng-if="XXX.config.editable" width="50px" />'
			+ ' </colgroup>'
			+ '	<thead>'
			+ '  <tr>'
			+ '   <th class="align_cen">등록일자</th>'
			+ '   <th class="align_cen">파일명</th>'
			+ '   <th ng-if="XXX.config.editable" class="align_cen">삭제</th>'
			+ '  </tr>'
			+ ' </thead>'
			+ ' <tbody>'
			+ '  <tr ng-repeat="x in XXX.data">'
			+ '   <td class="align_cen">{{x.REG_DT}}</td>'
			+ '   <td class="align_lft"><a ng-click="XXX.api.download(x.FILE_ID)" class="attch_file_name">{{x.ORIGNL_FILE_NM}}</a></td>'
			+ '   <td ng-if="'+ngIfDel+'" class="align_cen"><a ng-click="XXX.api.removeFile(x.FILE_ID)"><i class="fa fa-close" title="삭제"></i></a></td>'
			+ '  </tr>'
			+ '  </tbody>'
			+ '</table>'
			;

		//외곽없는 리스트(추가버튼은 사용자가 작성)
		this._templateSet.view
			= '<table style="width:100%; height:100%">'
			+ ' <tr valign="top">'
			+ '  <td class="align_lft" style="width:70%;">'
			+ '   <table style="width:100%">'
			+ '    <tr ng-if="XXX.config.editable">'
			+ '     <td class="align_lft" style="border:0;">{{XXX.config.placeholder}}</td>'
			+ '    </tr>'
			+ '    <tr ng-repeat="x in XXX.data" valign="top" style="height:1.5em;">'
			+ '     <td class="align_lft" style="border:0;">'
			+ '      <a ng-click="XXX.api.download(x.FILE_ID)" class="attch_file_name">{{x.ORIGNL_FILE_NM}}</a>'
			+ '      <spna ng-if="'+ngIfDel+'">&nbsp;&nbsp;&nbsp;<a ng-click="XXX.api.removeFile(x.FILE_ID)"><i class="fa fa-close" title="삭제"></i></a><span>'
			+ '     </td>'
			+ '    </tr>'
			+ '   </table>'
			+ '  <td>'
			+ ' </tr>'
			+ '</table>'
			;

	}//end-_init
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// template html contents 반환
	//-----------------------------------------------------
	_parseTemplate = (model, template) => {
		template = template||"normal";
    	this._debug(model.name+"._parseTemplate:"+template);
    	//설정된 template으로 UI작성
    	const html = (this._templateSet[template] || this._templateSet["normal"]).replace(/XXX/g, model.name);
		return html;
	}//end-_parseTemplate

	///////////////////////////////////////////////////////
	// 파일첨부 directive(atchList, atchModal) 작성
	//-----------------------------------------------------
	_buildAttachDirective = (app, directiveName, modelName) => {
		app.directive(directiveName, ($compile, $timeout, blockUI) => {
			const ret = {
				scope: false,
			};
			if (directiveName === "attachModal") {
				ret.template = '<div class="modal-dialog">'
					+ ' <div class="modal-content">'
					+ '  <div class="modal-header"   style="height:41px">'
					+ '   <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
					+ '   <h4 class="modal-title">화일첨부</h4>'
					+ '  </div>'
					+ '  <div class="modal-body">'
					+ '   <div class="ibox">'
					+ '    <div class="attach-list"></div>'
					+ '   </div>'
					+ '  </div>'
					+ ' </div>'
					+ '</div>'
					;
			}
			
			ret.compile = (el, attrs) => {
				return {
					pre: (scope, el, attrs, controller) => {
						const name = el.attr(modelName);
			        	const model = this.getWithPath(scope, name);
			        	model.name = name;
			        	model.data = model.data||[];
			        	
			        	//configuration initialize
			        	if (model.config.multiple) {
			        		model.config.upload_limit_one = model.config.upload_limit_one||3;
			        		model.config.upload_limit_all = model.config.upload_limit_all||20;
			        	} else {
			        		model.config.upload_limit_one = 1;
			        		model.config.upload_limit_all = 1;
			        	}
			        	model.config.DISPLAY_ADD = model.config.DISPLAY_ADD||"switch";	//switch(config.editable일때 show)/show/hide
			        	model.config.DISPLAY_DEL = model.config.DISPLAY_DEL||"switch";	//switch(config.editable일때 show)/show/hide
			        	this._debug(directiveName+" scope."+model.name+":"+JSON.stringify(model));
			        	
			        	//UI에서 model에 대해 사용할 API 작성
			        	model.api = {
			        		load		: () => {
				    			this._debug(model.name+".api.load");
				     			this._load(model);
				    		},
				    		upload		: () => {
								this._debug(model.name+".api.upload");
								this._upload(model);
				    		},
				    		download	: (fileId) => {
								this._debug(model.name+".api.download - fileno:"+fileId);
								this.download(this._settings.URL_FILE_DOWNLOAD, {FILE_ID:fileId});
				    		},
				    		removeFile	: (fileId) => {
								this._debug(model.name+".api.removeFile - fileno:"+fileId);
								this._removeFile(model, fileId);
				    		},
				    		blockUI		: (block) => {
				    			this._debug(model.name+".api.blockUI("+block+")-"+blockUI);
				    			if (block) {
									blockUI.start();
								} else {
									$timeout(() => {
										blockUI.stop();
									});
								}
							}
				    	};
			        	this._debug(directiveName+" scope."+model.name+".api: instance");

			        	if (directiveName === "attachList") {
				        	const $html = $compile(this._parseTemplate(model, el.attr("template")))(scope);
				        	el.append($html);
			        		
			        	} else if (directiveName === "attachModal") {
				        	model.api.modal = (load) => {
				    			$(".modal-title", el).text(model.config.title||"파일첨부");
				    			if (load === false) {
				        			$(el).modal();
				    			} else {
					    			this._load(model).then((response) => {
					        			$(el).modal();
					    			});
				    			}
				    		};

							//첨부목록 UI작성
				        	const $html = $compile(this._parseTemplate(model, el.attr("template")))(scope);
				        	el.find(".attach-list").append($html);
 			        	}

			        },
			        post: (scope, el, attrs, controller) => {}
				};
			};//ret.compile
			return ret;
		});
	}//end-_buildAttachDirective
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// load file list
	//-----------------------------------------------------
	_load = (model) => {
		return new Promise((resolve) => {
	        const param = {FILE_BINDER_ID: model.config.FILE_BINDER_ID};
			model.api.blockUI(true);
			this.fetch({
				url	: this._settings.URL_FILE_LIST,
				body: param
			}).then((response) => {
				model.data  = response.success;
				this._debug(model.name+".api.load result:"+model.data.length);
				if (model.config.onLoad) {
					this._debug(model.name+".config.onLoad:"+model.data.length);
					model.config.onLoad(response.success);
				}
				resolve(response.success);
				
			}).finally(() => {
				model.api.blockUI(false);
			});
		});
		
	}//end-_load

	///////////////////////////////////////////////////////
	// file upload
	//-----------------------------------------------------
	_upload = (model) => {
    	if (model.config.upload_limit_all <= model.data.length) {
    		alert("허용된 최대 첨부파일 수는 " + model.config.upload_limit_all + "개 입니다.");
    		return;
    	}
		const param = this.extend({FILE_BINDER_ID : model.config.FILE_BINDER_ID||''}, model.config.data);
   		
    	this.upload({
    		url			: this._settings.URL_FILE_UPLOAD,
    		data		: param,
    		before		: (opts) => {
				model.api.blockUI(true);
        	},
			accept		: model.config.accept||".xlsx, .docx, .pptx, .html, image",
			multiple	: model.config.multiple,
			limit_cnt	: this.minNum(model.config.upload_limit_one, model.config.upload_limit_all - model.data.length)
        })
        .then((response) => {
			this._debug(model.name+".api.upload result:"+response.success.length);
        	this.addRows(model.data, response.success);
			if (!model.config.FILE_BINDER_ID) {
				model.config.FILE_BINDER_ID = model.data[0].FILE_BINDER_ID
			}
			if (model.config.onAdd) {
				this._debug(model.name+".config.onAdd:"+response.success.length);
				model.config.onAdd(response.success);
			}
		})
		.finally(() => {
			model.api.blockUI(false);
		});
	}//end-_upload
	
	///////////////////////////////////////////////////////
	// delete file
	//-----------------------------------------------------
	_removeFile = (model, fileId) => {
		const rows = this.findRows(model.data, "FILE_ID", fileId);
		if (rows.length === 1 && confirm((rows[0].ORIGNL_FILE_NM||"파일") + "을 삭제 하시겠습니까?")) {
			const param = {FILE_ID:fileId};
			model.api.blockUI(true);
			this.fetch({
				url	: this._settings.URL_FILE_DELETE,
				body: param
			})
			.then((response) => {
				this._debug(model.name+".api.removeFile result:"+fileId);
				this.removeRows(model.data, rows);
    			if (model.config.onDel) {
    				this._debug(model.name+".config.onDel:"+fileId);
    				model.config.onDel(rows[0]);
    			}
			})
			.finally(() => {
				model.api.blockUI(false);
			});
		}
	}//end-_removeFile
	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================

}//class NgUiAtch




/**
 * angular js - ui-grid 관련
 *
 * @author	염국선
 * @since	2022.01.20
 */
class NgGridUtil extends ExcelUtil {
	
	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//excel utility
	excelUtil; 
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	
		
		
	//=========================================================================
	// 생성자
	//-------------------------------------------------------------------------
	constructor(settings) {
		super({name:"NgGridUtil", debug:true});
		this._settings = this.extend(this._settings, settings);
 		this._debug("constructor_settings:"+JSON.stringify(this._settings));
 		//ExcelUtil 생성
 		this.excelUtil = new ExcelUtil({name:"ExcelUtil", debug:this._settings.debug});
	}//end-constructor(settings) {
	//-------------------------------------------------------------------------
	// //생성자
	//=========================================================================
	
		
		
		
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------
	///////////////////////////////////////////////////////
	// basic grid options instance
	//-----------------------------------------------------
	// 	onRegisterApi	:
	// 		(gridApi) => {
	// 			$scope.mstGridApi = gridApi;
	// 			gridApi.selection.on.rowSelectionChanged($scope, (row) => {});
	// 			gridApi.selection.on.rowSelectionChangedBatch($scope, (row) => {});	
	// 		},
	//-----------------------------------------------------
	//	- api.grid.options
	//	- api.grid.appScope
	//	- api.core.notifyDataChange(uiGridConstants.dataChange.COLUMN)
	//	- api.addToGridMenu(grid, items)
	//	- api.core.refresh()
	//	- api.core.queueGridRefresh()
	//	- api.core.refreshRows()
	//	- api.core.handleWindowResize()
	//	- api.core.scrollTo(row, col);
	//	- api.core.on.onRegisterApi = (gridApi) => {...};
	//	- api.core.on.rowSelectionChanged = ($scope, (row) => {...});
	//	- api.core.on.columnVisibilityChanged = ($scope, (column) => {...});
	//-----------------------------------------------------
	instanceGridOptions = (options) => {
		//this._debug("instanceGridOptions - options:"+JSON.stringify(options));

		const gridOptions = 
			{
 				enableGridMenu				: true,		//그리드메뉴활성화			
				enableSorting				: true,		//정렬
				enableFiltering				: true,		//필터링
				enableRowSelection			: true,		//행선택
				enableRowHeaderSelection	: false,	//Row선택을 위한 왼쪽 체크영역 활성화 여부
				multiSelect					: false,	//다중선택
				noUnselect					: false,	//선택취소못함			
				showColumnFooter			: false,	//sum, avg
				showGridFooter				: true,		//total rows
				gridFooterHeight			: 12,		//showGridFooter 높이
				enableCellEdit				: false,
				enablePaginationControls	: false,
				useExternalSorting			: false,
				useExternalFiltering		: false,

// 				rowHeight					: 30,
// 				excludeProperties			: '__metadata',

// 				showTreeExpandNoChildren	: false,
// 				showTreeRowHeader			: true,
// 				enableExpandableRowHeader	: true,

// 				customGridName				: "",		//그리드명, 데이터 검증 alert 시 그리드명으로 사용
// 				customStateId				: "",		//저장된 columnDefs 사용시 ID(화면ID / gridOption name)
// 				gridMenuCustomItems			:			//다중그리드 엑셀작성시 
// 					[
// 						{
// 							title	: '다중그리드 엑셀작성',
// 							action	: () => {
// 									const exportConfig
// 										[
// 											{
// 												gridApi	: $scope.mstGridApi,
// 												opts	: 
// 													{
// 														type		: "normal",
// 														sheetName	: "마스터",
// 														showTitle	: true,
// 														showHeader	: true,
// 														title		: "마스터제목"
// 													}
// 											},
// 											{
// 												gridApi	: $scope.subGridApi,
// 												opts	: 
// 													{
// 														type		: "simple",
// 														sheetName	: "상세",
// 														showTitle	: true,
// 														showHeader	: true,
// 														title		: "상세제목"
// 													}
// 											}
// 										];
// 		                    		NG_GRD.exportToExcelFromGrid("다중그리드다운.xlsx", exportConfig);
// 	                			},
// 	                		order	: 1
// 	                	}
// 					],

				exporterMenuCsv				: false,	//IE10+ 에서 지원
				exporterMenuPdf				: false,
				
// 				exporterPdfDefaultStyle		: {fontSize: 9},
// 				exporterPdfTableStyle		: {margin: [30, 30, 30, 30]},
// 				exporterPdfTableHeaderStyle	: {fontSize: 10, bold: true, italics: true, color: 'red'},
// 				exporterPdfHeader			: { text: "My Header", style: 'headerStyle' },
// 				exporterPdfFooter			:	
// 					function (currentPage, pageCount) {
// 						return {text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle'};
// 					},
// 				exporterPdfCustomFormatter	:	
// 					function (docDefinition) {
// 						docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
// 						docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
// 						return docDefinition;
// 					},
// 				exporterPdfOrientation		:	'portrait',
// 				exporterPdfPageSize			:	'LETTER',
// 				exporterPdfMaxGridWidth		:	500,
// 				exporterCsvLinkElement		:	angular.element(document.querySelectorAll(".custom-csv-link-location")),

// 				columnDefs		:
// 					[
// 						{displayName:'기초재고',	field:'BS_QTY',	width:'100',	type:'string',	cellClass:'align_rgt',	cellFilter:'skcdqty:row.entity.QTY_UN',
//							filter: {selectOptions:[{value:"10", label:"코드10명"}], type:uiGridConstants.filter.SELECT},
// 							exportType:"number",	//visible excel export 시 포맷되지 않게 숫자형으로
// 							footerCellFilter:'number:0',
// 							footerCellClass:'align_rgt',
// 							aggregationType: () => {
// 									if (!$scope.mstGridApi) {
// 										return 0;
// 									}
// 									return XUTL.sumRows($scope.mstGrid.data, ["BS_PPCST_AM", "BS_FXCST_AM"]);
// 								},
// 					]
			};//end-gridOptions
			this._debug("instanceGridOptions - default configuration:"+JSON.stringify(gridOptions));

			this.extend(gridOptions, options);

			//localStorage에 저장된 columnDefs.visible 속성 설정되었으면 저장 메뉴 작성하고 저장된 상태 적용
			if (gridOptions.customStateId) {
				gridOptions.gridMenuCustomItems = gridOptions.gridMenuCustomItems||[];
				//api.addToGridMenu(grid, items)
				gridOptions.gridMenuCustomItems.push({
					title	: "save state",
					action	: ($event) => {
						if (window.localStorage) {
							const columns = [];
							if (gridOptions.gridApi) {	//visible position 속성 처리
								for (let i=0; i<gridOptions.gridApi.grid.columns.length; i++) {
									const col = gridOptions.gridApi.grid.columns[i];
									columns.push({
										field	: col.field,
										visible	: col.visible
									});
								}

							} else {	//visible 속성만 가능
								for (let i=0; i<gridOptions.columnDefs.length; i++) {
									const col = gridOptions.columnDefs[i];
									columns.push({
										field	: col.field,
										visible	: col.visible
									});
								}
							}

							const json = JSON.stringify(columns);
							window.localStorage.setItem(gridOptions.customStateId, json);
							this._debug("instanceGridOptions - save state:"+gridOptions.customStateId+"\n"+json);
						}
					}
				});

				if (window.localStorage) {
					const json = window.localStorage.getItem(gridOptions.customStateId);
					if (json) {
						this._debug("instanceGridOptions -  apply state:"+gridOptions.customStateId);
						const columns = JSON.parse(json);
						const defs = [];
						this.addRows(defs, gridOptions.columnDefs);
						this.empty(gridOptions.columnDefs);

						for (let i=0; i<columns.length; i++) {
							const rows = this.findRows(defs, "field", columns[i].field, true);
							this.applyRows(rows, "visible", columns[i].visible);
							this.addRows(gridOptions.columnDefs, rows);
							this.removeRows(defs, rows);
						}
						this.addRows(gridOptions.columnDefs, defs);
					}
				}
			}//end-if (gridOptions.customStateId) {

			//onRegisterApi 이벤트시 grid.options.gridApi api 저장 
			const onRegisterApi = gridOptions.onRegisterApi;
			gridOptions.onRegisterApi = (gridApi) => {
				this._debug("instanceGridOptions - save gridApi");
				gridOptions.gridApi = gridApi;
				if (onRegisterApi) {
					onRegisterApi(gridApi);
				}
			}
			
			return gridOptions;
		
	}//end-instanceGridOptions
	///////////////////////////////////////////////////////	
	
	///////////////////////////////////////////////////////
	// grid 엑셀 export menu 추가
	//-----------------------------------------------------
	//	opts : //문자열일 경우 title
	//			{
	//				fileName: "엑셀.xlsx",	//grid.options.exporterExcelFilename 설정시 우선
	//				type: "normal", //normal:그리드 보이는 형태, simple:원본데이터
	//				sheetName: "sheet 1",
	//				showTitle: true,
	//				showHeader: header,
	//				title: "제목",
	//				styles: {titleStyle:{}, headerStyle:{}, dataStyle:{}}
	//			}
	//-----------------------------------------------------
	addExcelExportMenu = (gridOptions, opts) => {
		opts = opts||{};
		if (typeof(opts) === "string") {
			opts = {fileName:opts+".xlsx", title:opts};
		}
		opts.fileName = opts.fileName||((opts.title||"엑셀")+".xlsx");
		
		const menuCustItem = {
	 		title: 'Export visible data as EXCEL',
	 		action: () => {
	 			const fileName = gridOptions.gridApi.grid.options.exporterExcelFilename||opts.fileName;
	 			const exportConfig = {
	 				gridApi	: gridOptions.gridApi,
	 				opts	: 
	 					{
	 						type		: opts.type||"normal",	//normal/simple
	 						title		: opts.title,
	 						sheetName	: opts.sheetName||opts.title,
	 						showTitle	: true,
	 						showHeader	: true
	 					}
	 			}
 	 			this.exportToExcelFromGrid(fileName, exportConfig);
	 		},
	 		order: 1
		}
		if (opts.type === "simple") {
			menuCustItem.title = "Export raw data as EXCEL";
		}
		gridOptions.gridMenuCustomItems = gridOptions.gridMenuCustomItems||[];
		gridOptions.gridMenuCustomItems.push(menuCustItem);
	}//end-addExcelExportMenu
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 그리드별 시트 작성하여 엑셀파일로 생성
	//-----------------------------------------------------
	//	exportConfig	: 
	//		{
	//			gridApi : $scope.mstGridApi,
	// 			opts : 
	// 				{
	// 					type: "normal", //normal:그리드 보이는 형태, simple:원본데이터
	// 					sheetName: "sheet 1",
	// 					showTitle: true,
	// 					showHeader: header,
	// 					title: "제목",
	// 					styles: {titleStyle:{}, headerStyle:{}, dataStyle:{}}
	// 				}
	//		}
	//-----------------------------------------------------
	//	ex) grid options 에 설정하여 다중그리드 export
	// 	gridMenuCustomItems		: [{    title	: '다중그리드 엑셀작성',
	//         action	: () => {
	// 			const exportConfig = [
	// 				{
	// 					gridApi	: $scope.mstGridApi,
	// 					opts	: 
	// 						{
	// 							type		: "normal",
	// 							sheetName	: "마스터",
	// 							showTitle	: true,
	// 							showHeader	: true,
	// 							title		: "마스터제목"
	// 						}
	// 				},
	// 				{
	// 					gridApi	: $scope.subGridApi,
	// 					opts	: 
	// 						{
	// 							type		: "simple",
	// 							sheetName	: "상세",
	// 							showTitle	: true,
	// 							showHeader	: true,
	// 							title		: "상세제목"
	// 						}
	// 				}
	// 			];
	//             NG_GRD.exportToExcelFromGrid("다중그리드다운.xlsx", exportConfig);
	//         },
	//         order	: 1 
	//   }]
	//-----------------------------------------------------
	exportToExcelFromGrid = (fileName, exportConfig) => {
		this._debug("exportToExcelFromGrid - fileName:"+fileName);

		if (!Array.isArray(exportConfig)) {
			exportConfig = [exportConfig];
		}
		
		if (exportConfig.length === 0) {
			throw "엑셀을 작성 할 그리드 정보가 없습니다";
		}
		
		//Workbook 작성
		const wb = this.excelUtil.instanceWorkbook();

		//WorkSheet 작성
		for (let i=0; i<exportConfig.length; i++) {
			//sheet configuration 작성
			const sheetConfig = this._parseGridAsSheetConfig(exportConfig[i].gridApi, exportConfig[i].opts);
			this.excelUtil.buildWorksheet(wb, sheetConfig);
		}

		//파일로 저장
		this.excelUtil.saveWorkbook(wb, fileName);

		this._debug("exportToExcelFromGrid done");
		
	}//end-exportToExcelFromGrid
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// SELECT filter에 사용할 selectOptions 데이터로 코드목록 변환
	//-----------------------------------------------------
	//	- columnDefs : 
	//		[
	//			{field:'A',... filter:{selectOptions:NG_GRD.toFilterSelectOptions($scope.ds_code.TR_GB), type:uiGridConstants.filter.SELECT}}
	//		]
	//-----------------------------------------------------
	toFilterSelectOptions = (list, cdFld, valFld) => {
		this._debug("toFilterSelectOptions");
		
		cdFld	= cdFld||"CODE_CD";
		valFld	= valFld||"CODE_NM";
		
		const selectOptions = [];
		for (let i=0; i<list.length; i++) {
			selectOptions.push({
				value	: list[i][cdFld],
				label	: list[i][valFld]
			});
		}
		
		return selectOptions;
	}//end-toFilterSelectOptions
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// SELECT filter 설정
	//-----------------------------------------------------
	//	- .setSelectFilter($scope.mstGrid, "TR_GB", $scope.ds_code.TR_GB)
	//	.ui-grid-filter-select {
	//		color:black;
	//	}
	//-----------------------------------------------------
	setSelectFilter = (gridOptions, field, cdList, type) => {
		this._debug("setSelectFilter - " + field + "/" +type);

		const defs = this.findRows(gridOptions.columnDefs, "field", field);
		if (defs.length > 0) {
			const filter = 
				{
					selectOptions: this.toFilterSelectOptions(cdList),
					//condition: 2,	//uiGridConstants.filter.STARTS_WITH
					//placeholder: 'starts with...',
					//flags: { caseSensitive: true },
					//disableCancelFilterButton: false,
					type: "select"	//uiGridConstants.filter.SELECT -> "select"
				};
			//type: "input", condition: uiGridConstants.filter.GREATER_THAN/GREAT_THAN_OR_EQAL/LESS_THAN/LESS_THAN_OR_EQAL
			this.applyRows(defs, ["enableFiltering", "filter"], [true, filter]);
		}
	}//end-setSelectFilter
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// SELECT filter 설정
	//-----------------------------------------------------
	//	- columnDefs : [
	//			{field:"code", cellFilter:"codeName:grid.appScope.ds_code.TR_GB", filter:NG_GRD.getDispalyValueFilter($scope, "mstGrid")}	
	//		]
	//-----------------------------------------------------
	getDispalyValueFilter = (scope, name) => {
		this._debug("getDispalyValueFilter - " + name);

		//cell fillter적용된 값으로 검색
		const condition = (term, value, row, col) => {
			const matcher = new RegExp(term);
			return matcher.test(scope[name].gridApi.grid.getCellDisplayValue(row, col));
		}
		
		return {
			condition	: condition
		};
	}//end-getDispalyValueFilter
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// grid selectRow & scrollTo
	//-----------------------------------------------------
	//	- row : 문자열(first/last)/ index(숫자) / row / row array
	//	- opts : default {scroll:true} 
	//-----------------------------------------------------
	selectRow = (gridApi, row, opts) => {
		this._debug("selectRow - row:"+row);

		//데이터 없으면 실행 않함
		if (gridApi.grid.options.data.length === 0) {
			return;
		}

		//파라메터 보정
		if (!Array.isArray(row)) {
			row = row ? [row] : [];
		}
		opts = opts||{scroll:true};

		//first/last/index 일 경우 해당 row mapping
		for (let i=0; i<row.length; i++) {
			if (row[i] === "first") {
				row[i] = gridApi.grid.options.data[0];
			} else if (row[i] === "last") {
				row[i] = gridApi.grid.options.data[gridApi.grid.options.data.length-1];
			} else if (typeof(row[i]) === "number") {
				if (row[i] > -1 && row[i] < gridApi.grid.options.data.length) {
					 row[i] = gridApi.grid.options.data[row[i]];
				}
			}
		}

		//기존선택해제
		gridApi.selection.clearSelectedRows();

		setTimeout(() => {
			//row 선택
			for (let i=0; i<row.length; i++) {
				if (row[i]) {
					gridApi.selection.selectRow(row[i]);
				}
			}

			//스크롤
			if (opts.scroll && row.length > 0) {
				this.scrollTo(gridApi, row[0]);
			}
		}, 100);

	}//end-selectRow
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// grid scrolling
	//-----------------------------------------------------
	//	- row : 문자열(first/last)/ index(숫자) / row
	//	- col : 문자열(first/last/name)/ index(숫자) / col
	//-----------------------------------------------------
	scrollTo = (gridApi, row, col) => {
		this._debug("scrollTo - row:"+row+", col:"+col);

		//데이터 없으면 실행 않함
		if (gridApi.grid.options.data.length === 0 || gridApi.grid.columns.length === 0) {
			return;
		}

		//first/last/index/array 일 경우 해당 row mapping
		if (Array.isArray(row)) {
			if (row.length === 0) {
				row = null;
			} else {
				row = row[0];
			}
		} else if (row === "first") {
			row = gridApi.grid.options.data[0];
		} else if (row === "last") {
			row = gridApi.grid.options.data[gridApi.grid.options.data.length-1];
		} else if (typeof(row) === "number") {
			if (row > -1 && row < gridApi.grid.options.data.length) {
				 row = gridApi.grid.options.data[row];
			} else {
				row = null;
			}
		}
		
		//마지막 row는 scroll되지 않으므로 마지막 전의 row로 설정
		if (row && gridApi.grid.options.data.length > 1 && gridApi.grid.options.data.indexOf(row) === gridApi.grid.options.data.length-1) {
			row = gridApi.grid.options.data[gridApi.grid.options.data.length-2]
		}

		//first/last/name/index 일 경우 해당 col mapping
		if (typeof(col) === "string") {
			if (col === "first") {
				col = gridApi.grid.columns[0];
			} else if (col === "last") {
				col = gridApi.grid.columns[gridApi.grid.columns.length-1];
			} else {
				col = this.findRows(gridApi.grid.columns, "name", col, true);
				if (col.length === 0) {
					col = null;
				} else {
					col = col[0];
				}
			}
		} else if (typeof(col) === "number") {
			if (col > -1 && col < gridApi.grid.columns.length) {
				col = gridApi.grid.columns[col];
			} else {
				col = null;
			}
		}
		
		setTimeout(() => {
			gridApi.core.scrollTo(row, col);
			gridApi.core.refresh();
		}, 100);

	}//end-scrollTo
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 그리드 데이터 검증
	//-----------------------------------------------------
	//	opts : 
	// 		{
	// 			alert: true,
	// 			scroll: true,
	//			data: [],	//없을경우 gridApi.grid.options.data, 통상 선택된 데이터만 검증할 경우 사용
	// 		}
	//-----------------------------------------------------
	validateGridData = (gridApi, opts) => {
		//옵션이 없을 경우 기본옵션 설정
		opts = this.extend({alert:true, scroll:true}, opts);
		//validation 결과 처리
		const assertValid = (validation, opts) => {
			if (!validation.isValid) {
				if (opts.alert) {
					alert((gridApi.grid.options.customGridName||"그리드") + "의 " + validation.invalid.erMsg);
				}
				if (opts.scroll) {
					gridApi.core.scrollTo(validation.invalid.row, validation.invalid.colDef);
				}
			}
			return validation;
		};
		//반환될 데이터검증 결과
		const validation = {
			isValid		: true,
			validColDefs: [],
			validTypeSet: {},
			invalid		: {
				validType	: null,
				row			: null,
				colDef		: null,
				erMsg		: null
			}
		}
		//검증컬럼 및 유형 분석
		for (let i=0; i<gridApi.grid.options.columnDefs.length; i++) {
			const colDef = gridApi.grid.options.columnDefs[i];
			if (colDef && colDef.validTypes) {
				validation.validColDefs.push(colDef);
				validation.validTypeSet[colDef.field] = colDef.validTypes.split(","); 
			}
		}
		//데이터 검증
		if (validation.validColDefs.length > 0) {
			const entities = opts.data||gridApi.grid.options.data;
			for (let i=0; i<entities.length; i++) {
				const entity = entities[i];
				for (let j=0; j<validation.validColDefs.length; j++) {
					const colDef = validation.validColDefs[j];
					const validTypes = validation.validTypeSet[colDef.field];
					for (let k=0; k<validTypes.length; k++) {
						if (validTypes[k] === "required") {
							if (!entity[colDef.field]) {
								validation.isValid = false;
								validation.invalid.validType = validTypes[k];
								validation.invalid.entity = entity;
								validation.invalid.colDef = colDef;
								validation.invalid.erMsg = ((gridApi.grid.options.data.indexOf(entity))+1) + "행 " + colDef.displayName + " 항목은 필수 입력 입니다.";
								return assertValid(validation, opts);
							}
						}
					}//end-for (let k=0; k<validTypes.length; k++) {
				}//end-for (let j=0; j<validation.validColDefs.length; j++) {
			}//end-for (let i=0; i<entities.length; i++) {
		}
		
		return validation;
		
	}//end-validateGridData
	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //public 메서드
	//=========================================================================

	
		
		
	//=========================================================================
	// private 메서드
	//-------------------------------------------------------------------------
	///////////////////////////////////////////////////////
	// grid 와 옵션을 사용하여 sheet configuration 작성
	//-----------------------------------------------------
	//	opts : 
	// 		{
	// 			type: "normal", //normal:그리드 보이는 형태, simple:원본데이터
	// 			sheetName: "sheet 1",
	// 			showTitle: true,
	// 			showHeader: header,
	// 			title: "제목",
	// 			styles: {titleStyle:{}, headerStyle:{}, dataStyle:{}}
	// 		}
	//-----------------------------------------------------
	_parseGridAsSheetConfig = (gridApi, opts) => {
		this._debug("_parseGridAsSheetConfig - opts:"+JSON.stringify(opts));
		
		//sheet configuration 작성
		const config = {
				type		: opts.type||"normal",	//normal:그리드 보이는 형태, simple:원본데이터
				sheetName	: opts.sheetName,
				showTitle	: opts.showTitle,
				showHeader	: opts.showHeader || gridApi.grid.options.showHeader,
				title		: opts.title,
				columns		: [],
				data		: [],
				styles		: opts.styles||{}
			};
		this._debug("_parseGridAsSheetConfig - config:"+JSON.stringify(config));

		//엑셀 export를 위한 그리드 헤더 작성
		for (let i=0; i<gridApi.grid.columns.length; i++) {
			const col = gridApi.grid.columns[i];

			if (col.colDef.exporterSuppressExport) {
				continue;
			}
			if (!col.visible && config.type === "normal") {
				continue;
			}
			
			config.columns.push({
				name	: col.colDef.field,
				label	: col.colDef.displayName,
				width	: col.colDef.width,
				align	: col.colDef.cellClass === "align_rgt" ? "right" : (col.colDef.cellClass === "align_cen" ? "center" : "left")
			});
		}
		this._debug("_parseGridAsSheetConfig - columns:"+config.columns.length);
		
		//data 작성
		if (config.type === "normal") {
			//그리드에 표현된 데이터만 작성
			const rows = gridApi.grid.getVisibleRows();	//gridApi.grid.rows
			this._debug("_parseGridAsSheetConfig - getVisibleRows:"+rows.length);
			for (let i=0; i<rows.length; i++) {
				const row = rows[i];
				const entity = {};
				for (let j=0; j<gridApi.grid.columns.length; j++) {
					const col = gridApi.grid.columns[j];
					if (col.visible && !col.colDef.exporterSuppressExport) {
						//grid 엑셀 export 시 추가 option 처리
						if (col.colDef.exportType === "number") {
							//숫자포맷등의 fillter 적용된 숫자형으로 해당 컬럼 데이터 변경
							entity[col.colDef.name] = this.toNum(gridApi.grid.getCellValue(row, col));
						} else {
							entity[col.colDef.name] = gridApi.grid.getCellDisplayValue(row, col);
						}
					}
				}
				config.data.push(entity);
			}
			
		} else if (config.type === "simple") {
			config.data = gridApi.grid.options.data;
		}
		this._debug("_parseGridAsSheetConfig - data:"+config.data.length);

		return config;
		
	}//end-_parseGridAsSheetConfig
	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================

}//class NgGridUtil




/**
 * angular js - ui-grid cell template 관련
 *
 * @author	염국선
 * @since	2022.01.28
 */
class NgCellTemplateUtil extends DataUtil {
	
	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	
		
		
	//=========================================================================
	// 생성자
	//	- CELL_INPUT_HEIGHT 
	//	- CELL_COMBO_HEIGHT
	//	- CELL_CHECKBOX_HEIGHT
	//	- CELL_DATE_HEIGHT
	//	- CELL_TEXTAREA_HEIGHT
	//-------------------------------------------------------------------------
	constructor(settings) {
		super({name:"NgGridCellUtil", debug:true});
		this._settings = this.extend(this._settings, settings);
 		this._debug("constructor_settings:"+JSON.stringify(this._settings));
	}//end-constructor(settings) {
	//-------------------------------------------------------------------------
	// //생성자
	//=========================================================================
	
		
		
		
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------
	// ui-grid cellTemplate 내의 객체
	//	grid
	//		- grid.appScope
	//		- grid.renderContainers.body.visibleRowCache.indexOf(row)
	//	row
	//		- row.entity, row.entity[col.field]
	//	col
	//		- col.field
	//		- col.colDef.field
	//		- col.getAggregationValue()
	//	COL_FIELD
	//	CUSTOM_FILTERS
	//	MODEL_COL_FIELD
	//-------------------------------------------------------------------------
	//#####################################################
	//	renderer 관련
	//-----------------------------------------------------
	///////////////////////////////////////////////////////
	// 순번을 보여주는 cell Template
	//-----------------------------------------------------
	getRowNumRenderer = () => {
		return '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>';
	}//end-getNoCellTemplate
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// 사용여부 cell Template
	//-----------------------------------------------------
	getCheckboxRenderer = (trueValue = "Y", falseValue = "N") => {
		return '<div><input type="checkbox" ng-model="row.entity[col.field]" ng-true-value="\''+trueValue+'\'" ng-false-value="\''+trueValue+'\'" ng-disabled="true"></div>';
	}//end-getCheckboxRenderer
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 정사각형색상 color cell Template
	//	- ng-style적용하면 그리드 스크롤 시 처음영역 그대로 컬러표현되는 오류 있음, map을 대신 사용
	//-----------------------------------------------------
	//	opts
	//		.map			: 값에 대한 컬러정의, {Y:"blue", N:"red"}
	//		.colorField		: 값 참조 컬럼명, optional
	//		.labelField		: 값 참조 컬럼명, optional
	//		.labelVisible	: 값 보여줄지 여부, default false
	//		.style			: style정의 문자열, optional
	//-----------------------------------------------------
	//	columnDef	: cellTemplate:pwoStColorBox, enableFiltering:false
	//-----------------------------------------------------
	getColorRenderer = (opts) => {
		const colorField	= opts.colorField ? "row.entity['" + opts.colorField + "']" : "COL_FIELD";
 		const labelField	= opts.labelField ? "row.entity['" + opts.labelField + "']" : "COL_FIELD CUSTOM_FILTERS";
		const conStyle		= opts.labelVisible ? "display:flex;justify-content:start" : "display:flex;justify-content:center";
		const boxStyle		= opts.style||"width:20px;height:20px;border:1px solid silver;";

		let template = '<div class="ui-grid-cell-contents" style="' + conStyle + '">';

		Object.keys(opts.map).forEach((key) => {
			const color = opts.map[key];
			template += ' <div ng-if="' + colorField + ' === \'' + key + '\'" >';
			template += ' <div style="display:inline-block;' + boxStyle + 'background-color:' + color + ';">&nbsp;</div>';
			if (opts.labelVisible) {
				template += ' <div style="display:inline-block;min-width:20px;width:100%;height:20px;margin-left:5px;">'+'{{' + labelField + '}}'+'</div>';
			}
			template += ' </div>';
		});

		template += '</div>';

		return template;
		
	}//end-getColorRenderer
	

	///////////////////////////////////////////////////////
	// 아이콘 cell Template
	//-----------------------------------------------------
	//	opts
	//		.list			: 코드
	//		.iconField		: 값 참조 컬럼명, optional
	//		.map			: 값에 대한 컬러정의, {Y:"blue", N:"red"}
	//		.colorField		: 값 참조 컬럼명, optional
	//		.labelField		: 값 참조 컬럼명, optional
	//		.labelVisible	: 값 보여줄지 여부, default false
	//		.style			: style정의 문자열, optional
	//-----------------------------------------------------
	//	columnDef	: cellTemplate:pwoStColorBox, enableFiltering:false
	//-----------------------------------------------------
	getIconRenderer = (opts) => {
		const iconField	= opts.iconField ? "row.entity['" + opts.iconField + "']" : "COL_FIELD";
 		let template = '<div class="ui-grid-cell-contents text-center">';

 		for (let i=0; i<opts.list.length; i++) {
 			template += ' <i ng-if="' + iconField + ' === \'' + opts.list[i] + '\'" class="fa ' + opts.list[i] + '"></i>';
 		}

 		template += '</div>';

		return template;
		
	}//end-getIconRenderer
	
	///////////////////////////////////////////////////////
	// anchor cell Template
	//-----------------------------------------------------
	//	- opts
	//		{
	//			ngIf			: ngIf 존재시 anchor 표시
	//			ngClick			: ng-click 처리 (row.entity, grid)
	//			render			: 데이터 포맷
	//		}
	//-----------------------------------------------------
	getAnchorRenderer = (opts) => {
		//render syntax
		const render = opts.render ? '{{grid.appScope.' + opts.render + '(col.colDef.field, row.entity, grid, row)}}' : '{{COL_FIELD CUSTOM_FILTERS}}';
		opts.openMarkup		= '<a href="#" ';
		opts.closeMarkup	= '>' + render + '</a>';
		
		return this.getDomRenderer(opts);
	}//end-getAnchorRenderer
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// anchor cell Template
	//-----------------------------------------------------
	//	- opts
	//		{
	//			ngIf			: ngIf 존재시 anchor 표시
	//			ngClick			: ng-click 처리 (row.entity, grid)
	//			ngDblclick		: ng-dblclick 처리 (row.entity, grid)
	//			render			: 데이터 포맷
	//			openMarkup		: '<i',
	//			closeMarkup		: ' class="fa fa-search"></i>'
	//		}
	//-----------------------------------------------------
	getDomRenderer = (opts) => {
		let attrs	= ""; //속성정의

		//click event
		if (opts.ngClick) {
			attrs += ' ng-click="grid.appScope.' + opts.ngClick + '(col.colDef.field, row.entity, grid, row)"'
		}
		//double click event
		if (opts.ngDblclick) {
			attrs += ' ng-dblclick="grid.appScope.' + opts.ngDblclick + '(col.colDef.field, row.entity, grid, row)"'
		}
		
		//render syntax
		const render = opts.render ? '{{grid.appScope.' + opts.render + '(col.colDef.field, row.entity, grid, row)}}' : '{{COL_FIELD CUSTOM_FILTERS}}';
		//ngIf syntax
		const ngIf = this.isEmpty(opts.ngIf) ? '(true)' : '(grid.appScope.' + opts.ngIf + '(col.colDef.field, row.entity, grid, row))';
		
		let template	= "";
		template += ' <div ng-if="!' + ngIf + '" ' + ' class="ui-grid-cell-contents">' + render + '</div>';
		template += ' <div ng-if="' + ngIf + '" class="ui-grid-cell-contents">' + opts.openMarkup + ' ' + attrs  + opts.closeMarkup + '</div>';

		return template;
	}//end-getDomRenderer
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// 사용여부 cell Template
	//-----------------------------------------------------
	//	- opts
	//		{
	//			ngClick			: ng-click 처리 (row.entity, grid)
	//			ngDblclick		: ng-dblclick 처리 (row.entity, grid)
	//			toggleSelection	: true, 클릭시 selection toggle
	//		}
	//-----------------------------------------------------
	getRowTemplate = (opts) => {
		let template = '<div ';
		
		if (opts.ngClick) {
			template += 'ng-click="grid.appScope.' + opts.ngClick + '(col.colDef.field, row.entity, grid)" ';
		} else if(typeof(opts.toggleSelection) === "string") {
			template += 'ng-click="grid.appScope.' + opts.toggleSelection + '(col.colDef.field, row.entity, grid) ? (grid.api.selection.getSelectedRows().indexOf(row.entity) == -1 ? grid.api.selection.selectRow(row.entity) : grid.api.selection.unSelectRow(row.entity)) : (0)" ';
		} else if(opts.toggleSelection === true) {
			template += 'ng-click="grid.api.selection.getSelectedRows().indexOf(row.entity) === -1 ? grid.api.selection.selectRow(row.entity) : grid.api.selection.unSelectRow(row.entity)" ';
		}
		if (opts.ngDblclick) {
			template += 'ng-dblclick="grid.appScope.' + opts.ngDblclick + '(col.colDef.field, row.entity, grid)" ';
		}
		template += 'ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell>';

		template += '</div>'

		return template;
	}//end-getRowTemplate
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// footer aggregation cell Template
	///////////////////////////////////////////////////////
	getFooterSumRenderer = (filter) => {
		const template = '<div class="ui-grid-cell-contents align_cen">{{col.getAggregationValue() | ' + (filter||'number') + '}}</div>';
		return template;
	}//end-getFooterSumRenderer
	//-----------------------------------------------------
	//	//renderer 관련
	//#####################################################


	//#####################################################
	//	edit 관련
	//-----------------------------------------------------
	///////////////////////////////////////////////////////
	// 데이터에 row edit cell Template
	//-----------------------------------------------------
	//	- opts
	//		{
	//			permanent		: 항상에디팅여부(default:false-row._rowEditable이 true일떄 보임)
	//			model 			: ng-model이 아닌경우 설정, optional
	//			ngIf			: ng-if 처리, optional
	//			ngDisabled		: ng-disabled 처리, optional
	//			ngChange		: ng-change 처리, optional
	//			ngEnter			: ng-enter 처리, optional
	//			ngClick			: ng-click 처리, optional
	//			ngTrueValue		: ng-true-value, 체크박스시
	//			ngFalseValue	: ng-false-value, 체크박스시
	//			change			: change event, optional
	//			render			: data render
	//			selectOnFocus	: true/false, 포커스 받으면 입력문자 전체 선택
	//			attributes		: ["numbers-only"], //kr-cell, number-format
	//			dataType		: "number"
	//		}
	//-----------------------------------------------------
	//	NG_CELL.getEditCell({
	//     	permanent	: true,
	//     	ngIf		: "lfn_cell_show",
	//     	ngDisabled	: "lfn_cell_disabled",
	//     	ngChange	: "lfn_cell_onChange",
	//	문자형
	//     	attributes	: ["kr-cell"]
	//	숫자형
	//     	attributes	: ["numbers-only"],
	//     	dataType	: "number"
	//	}
	//-----------------------------------------------------
	getEditCell = (opts) => {
		let editTemplate = '<input ';
		editTemplate += this._buildEditAttrs(opts);
		if (opts.dataType === "number") {
			editTemplate += ' class="text-right" ';
		} else if(opts.dataType === "time") {
			editTemplate += ' class="text-center" ';
		}
		editTemplate += ' style="height:' + (this._settings.CELL_INPUT_HEIGHT||'auto') + ';"></input>';
		
		return this._buildCellTemplate(opts, editTemplate);
	}//end-getEditCell
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// number format cell Template
	//-----------------------------------------------------
	//	- opts
	//		{
	//			...
	//			digit:4,
	//			sign:true,
	//		}
	//-----------------------------------------------------
	//	NG_CELL.getNumFormatCell({
	//     	permanent		: true,
	//     	ngIf			: "lfn_cell_show",
	//     	ngDisabled		: "lfn_cell_disabled",
	//     	ngChange		: "lfn_cell_onChange",
	//     	selectOnFocus	: true,
	//     	digit			: 2,
	//     	sign			: true
	//	}
	//-----------------------------------------------------
	getNumFormatCell = function (opts) {
		opts = this.extend({}, opts);
		opts.model = "model";
		if (opts.ngChange) {
			opts.change = opts.ngChange;
			delete opts.ngChange;
		}
		
		let editTemplate = '<input number-format digit="' + (opts.digit||'0') + '" sign="' + (opts.sign||'false') + '" ';
		editTemplate += this._buildEditAttrs(opts);
		editTemplate += ' class="text-right ng-pristine ng-untouched ng-valid ng-empty"' + ' style="height:' + (this._settings.CELL_INPUT_HEIGHT||'auto') + ';">';
		editTemplate += '</input>';	//ng-model 없으므로 강제설정(ng-pristine ng-untouched ng-valid ng-empty)
		
		return this._buildCellTemplate(opts, editTemplate);
	}//end-getNumFormatCell

	///////////////////////////////////////////////////////
	// combo cell Template
	//-----------------------------------------------------
	//	NG_CELL.getComboCell("ds_code.TR_GB", {
	//     	permanent		: true,
	//     	ngIf			: "lfn_cell_show",
	//     	ngDisabled		: "lfn_cell_disabled",
	//     	ngChange		: "lfn_cell_onChange"
	//	}
	//-----------------------------------------------------
	getComboCell = (codeListName, opts) => {
		let editTemplate = '<select ';
		editTemplate += this._buildEditAttrs(opts);
		if (codeListName.indexOf("#") === 0) {
			editTemplate += ' style="height:' + (this._settings.CELL_COMBO_HEIGHT||'auto') + ';"><option ng-repeat="x in ' + codeListName.substring(1) + '" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option></select>';
		} else {
			editTemplate += ' style="height:' + (this._settings.CELL_COMBO_HEIGHT||'auto') + ';"><option ng-repeat="x in grid.appScope.' + codeListName + '" value="{{x.CODE_CD}}">{{x.CODE_NM}}</option></select>';
		}
		return this._buildCellTemplate(opts, editTemplate);
	}//end-getComboCell

	///////////////////////////////////////////////////////
	// multi combo cell Template
	//-----------------------------------------------------
	//	NG_CELL.getMultiComboCell({
	//     	permanent		: true,
	//     	ngIf			: "lfn_cell_show",
	//     	ngDisabled		: "lfn_cell_disabled",
	//     	ngChange		: "lfn_cell_onChange"
	//	}
	//-----------------------------------------------------
	getMultiComboCell = (codeListName, opts) => {
		let editTemplate = '<div multi-combo sel-model="MODEL_COL_FIELD" list-model="grid.appScope.' + codeListName + '" ';
 		editTemplate += this._buildEditAttrs(opts);
		editTemplate += ' style="padding:2px;"></div>';
		return this._buildCellTemplate(opts, editTemplate);
	}//end-getMultiComboCell

	///////////////////////////////////////////////////////
	// checkbox cell Template
	//-----------------------------------------------------
	//	NG_CELL.getCheckboxCell({
	//     	permanent		: true,
	//     	ngIf			: "lfn_cell_show",
	//     	ngDisabled		: "lfn_cell_disabled",
	//     	ngChange		: "lfn_cell_onChange"
	//	}
	//-----------------------------------------------------
	getCheckboxCell = (opts) => {
		opts.ngTrueValue	= opts.ngTrueValue||"Y";
		opts.ngFalseValue	= opts.ngFalseValue||"N";
		
		let editTemplate = '<input type="checkbox" ng-model="MODEL_COL_FIELD" name="{{col.colDef.field}}"';
		editTemplate += this._buildEditAttrs(opts);
		editTemplate += ' style="height:' + (this._settings.CELL_CHECKBOX_HEIGHT||'auto') + ';"></input>';
		return this._buildCellTemplate(opts, editTemplate);
	}//end-getCheckboxCell

	///////////////////////////////////////////////////////
	// date cell Template
	//-----------------------------------------------------
	//	- opts
	//		{
	//			...
	//			dateFormat:미설정시 YYYY-MM-DD
	//		}
	//-----------------------------------------------------
	//	NG_CELL.getDateCell({
	//     	permanent		: true,
	//     	ngIf			: "lfn_cell_show",
	//     	ngDisabled		: "lfn_cell_disabled",
	//     	ngChange		: "lfn_cell_onChange"
	//	}
	//-----------------------------------------------------
	getDateCell = (opts) => {
		opts = this.extend({}, opts);
		if (opts.ngChange) {
			opts.change = opts.ngChange;
			delete opts.ngChange;
		}
		
		let wrapAttrs = 'format="' + (opts.dateFormat?opts.dateFormat:'YYYY-MM-DD') + '" start-view="month" locale="ko" moment-picker="MODEL_COL_FIELD"';
		if (opts.change) {
			wrapAttrs += ' change="grid.appScope.' + opts.change + '(col.colDef.field, row.entity, grid)"';
			delete opts.change;
		}
		
		let editTemplate = '<input ng-model-options="{ updateOn: \'blur\' }" readonly tabindex="0" style="width:80%; height:' + (this._settings.CELL_DATE_HEIGHT||'auto') + ';" type="text"';
		editTemplate += this._buildEditAttrs(opts);
		editTemplate += '></input><span><i class="fa fa-calendar"></i></span>';
		return this._buildCellTemplate(opts, editTemplate, wrapAttrs);
	}//end-getDateCell
	
	///////////////////////////////////////////////////////
	// textarea cell Template
	//-----------------------------------------------------
	//	NG_CELL.getTextCell({
	//     	permanent		: true,
	//     	ngIf			: "lfn_cell_show",
	//     	ngDisabled		: "lfn_cell_disabled",
	//     	ngChange		: "lfn_cell_onChange"
	//	}
	//-----------------------------------------------------
	getTextCell = (opts) => {
		let editTemplate = '<textarea ';
		editTemplate += this._buildEditAttrs(opts);
		editTemplate += ' style="height:' + (this._settings.CELL_TEXTAREA_HEIGHT||'auto') + ';"></textarea>';
		return this._buildCellTemplate(opts, editTemplate);
	}//end-getTextCell

	///////////////////////////////////////////////////////
	// Dom cell Template
	//-----------------------------------------------------
	//	NG_CELL.getDomCell({
	//     	permanent		: true,
	//     	ngIf			: "lfn_cell_show"
	//		ngClick			: "lfn_cell_onClick"
	//		render			: "lfn_cell_render"
	//	}
	//-----------------------------------------------------
	getDomCell = (opts, html, attrs) => {
		return this._buildCellTemplate(opts, html, attrs);
	}//end-getDomCell

	///////////////////////////////////////////////////////
	// row editor 활성화 - _rowEditable = true 설정 (permanent false 일 경우)
	//-----------------------------------------------------
	startRowEdit = (list, row) => {
		if (!Array.isArray(row)) {
			row = [row];
		}
		for (let i=0; i<row.length; i++) {
			if (row[i].grid && row[i].grid.rows) {
				list[row[i].grid.rows.indexOf(row[i])]._rowEditable = true;
			} else {
				row[i]._rowEditable = true;
			}
		}
	}//end-startRowEdit
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// row editor 비활성화 - _rowEditable = false 설정 (permanent false 일 경우)
	//-----------------------------------------------------
	stopRowEdit = (list, row) => {
		if (row) {
			if (row.grid && row.grid.rows) {
				list[row.grid.rows.indexOf(row)]._rowEditable = false;
			} else {
				row._rowEditable = false;
			}
		} else {
			for (let i=0; i<list.length; i++) {
				list[i]._rowEditable = false;
			}
		}
	}//end-stopRowEdit
	///////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////
	// 데이터에 row editable 여부
	//-----------------------------------------------------
	isRowEditable = (row) => {
		if (row) {
			return row._rowEditable;
		}
		return false;
	}//end-isRowEditable
	///////////////////////////////////////////////////////
	//-----------------------------------------------------
	//	//edit 관련
	//#####################################################
	//-------------------------------------------------------------------------
	// //public 메서드
	//=========================================================================

	
		
		
	//=========================================================================
	// private 메서드
	//-------------------------------------------------------------------------
	//#####################################################
	//	edit 관련
	//-----------------------------------------------------
	///////////////////////////////////////////////////////
	// edit cell 속성 정의
	//-----------------------------------------------------
	//	- opts
	//		{
	//			model 			: ng-model이 아닌경우 설정, optional
	//			ngIf			: ng-if 처리, optional
	//			ngDisabled		: ng-disabled 처리, optional
	//			ngChange		: ng-change 처리, optional
	//			ngEnter			: ng-enter 처리, optional
	//			ngTrueValue		: ng-true-value, 체크박스시
	//			ngFalseValue	: ng-false-value, 체크박스시
	//			change			: change event, optional
	//			selectOnFocus	: true/false, 포커스 받으면 입력문자 전체 선택
	//			attributes		: ["numbers-only"], //kr-cell, number-format
	//		}
	///////////////////////////////////////////////////////
	_buildEditAttrs = (opts) => {
		let editAttrs = (opts.model||'ng-model') + '="MODEL_COL_FIELD" name="{{col.colDef.field}}"';

		if (opts.ngDisabled) {
			editAttrs += ' ng-disabled="grid.appScope.' + opts.ngDisabled + '(col.colDef.field, row.entity, grid, row)"';
		}
		if (opts.ngChange) {
			editAttrs += ' ng-change="grid.appScope.' + opts.ngChange + '(col.colDef.field, row.entity, grid, row)"';
		}
		if (opts.ngEnter) {
			editAttrs += ' ng-enter="grid.appScope.' + opts.ngEnter + '(col.colDef.field, row.entity, grid, row)"';
		}
		if (opts.selectOnFocus) {
			editAttrs += ' onfocus="$(this).select()"';
		}
		if (opts.ngTrueValue) {
			editAttrs += ' ng-true-value="\'' + opts.ngTrueValue + '\'" ng-false-value="\'' + opts.ngFalseValue + '\'"';
		}
		if (opts.change) {
			editAttrs += ' change="grid.appScope.' + opts.change + '(scope.col.colDef.field, scope.row.entity, scope.grid, scope.row)"';
		}
		if (opts.attributes) {
			for (let i=0; i<opts.attributes.length; i++) {
				editAttrs += ' ' + opts.attributes[i];
			}
		}
		
		return editAttrs;
	}//end-_buildEditAttrs

	///////////////////////////////////////////////////////
	// 속성을 사용하여 cell 템플릿을 작성
	//	- <div><input/><div>
	//	- <div ng-if="false">label<div><div ng-if="true"><input/><div> 
	//-----------------------------------------------------
	//	- opt
	//		{
	//			permanent		: 항상에디팅여부(default:false-row._rowEditable이 true일떄 보임)
	//			ngClick			: ng-click 처리, optional
	//			render			: data render
	//		}
	//	- editTemplate	: 입력시 사용될 template
	//	attrs: 에디터 wrap div에 추가될 attribute text
	//-----------------------------------------------------
	_buildCellTemplate = (opts, editTemplate, wrapAddAttrs) => {
		wrapAddAttrs	= wrapAddAttrs||"";
		
		let template	= "";
		let wrapAttrs	= ""; //속성정의

		//click event
		if (opts.ngClick) {
			wrapAttrs += ' ng-click="grid.appScope.' + opts.ngClick + '(col.colDef.field, row.entity, grid, row)"'
		}
		
		/////////////////////////////////////////////////////
		//wrap open
		//---------------------------------------------------
		//render syntax
		const render = opts.render ? '(grid.appScope.' + opts.render + '(col.colDef.field, row.entity, grid, row))' : '{{COL_FIELD CUSTOM_FILTERS}}';
		//ngIf syntax
		let ngIf = "";
		if (opts.permanent) {
			if (this.isEmpty(opts.ngIf)) {
				ngIf = '(true)';
			} else {
				ngIf = '(grid.appScope.' + opts.ngIf + '(col.colDef.field, row.entity, grid, row))';
			}
		} else {
			if (this.isEmpty(opts.ngIf)) {
				ngIf = '(row.entity._rowEditable)';
			} else {
				ngIf = '(row.entity._rowEditable && grid.appScope.' + opts.ngIf + '(col.colDef.field, row.entity, grid, row))';
			}
		}
		
		template += ' <div ng-if="!' + ngIf + '" ' + wrapAttrs  + wrapAddAttrs + ' class="ui-grid-cell-contents">' + render + '</div>';
		template += ' <div ng-if="' + ngIf + '" ' + wrapAttrs  + wrapAddAttrs + ' class="ui-grid-cell-contents">';
		/////////////////////////////////////////////////////
		
		if (editTemplate) {
			template += ' ' + editTemplate;
		}
		
		//wrap close
		template += '</div>';
		
		return template;
		
	}//end-buildCellTemplate
	///////////////////////////////////////////////////////
	//-----------------------------------------------------
	//	//edit 관련
	//#####################################################
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================

}//class NgCellTemplateUtil
