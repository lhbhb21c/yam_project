/**
 * xml dom을 사용하여 xml 작성을 위한 class
 * 
 * @author	염국선
 * @since	2022.01.05
 */
class XmlDoc extends BaseUtil {
	
	//=========================================================================
	// 속성
	//-------------------------------------------------------------------------
	//window xml object
	_xmlDom;
	//-------------------------------------------------------------------------
	// //속성
	//=========================================================================

	
		
		
	//=========================================================================
	// 생성자
	//-------------------------------------------------------------------------
	constructor(settings) {
		super({name:"XmlDoc", debug:true});
		this._settings = this.extend(this._settings, settings);
 		this._debug("constructor_settings:"+JSON.stringify(this._settings));
		this._xmlDom = this._instanceXmlDom("<data></data>");
	}//end-constructor(settings) {
	//-------------------------------------------------------------------------
	// //생성자
	//=========================================================================
	
		
		
		
	//=========================================================================
	// public 메서드
	//-------------------------------------------------------------------------
	///////////////////////////////////////////////////////
	// XML DOM 반환
	//-----------------------------------------------------
	getXmlDom = () => {
		return this._xmlDom;
	}//end-getXmlDom
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// XML DOM 에 data object 를 append
	//-----------------------------------------------------
	appendXml = (name, data, parent) => {
		const dataEl = this._xmlDom.createElement(name);
		if (parent) {
			parent.appendChild(dataEl);
		} else {
			this._xmlDom.documentElement.appendChild(dataEl);
		}
		
		if (this.isEmpty(data)) {
			dataEl.appendChild(this._xmlDom.createTextNode(""));
 		} else if (Array.isArray(data)) {
			for (let i=0; i<data.length; i++) {
				if (data[i]) {
					this.appendXml("row", data[i], dataEl);
				}
			}
		} else if (typeof(data) === "object") {
 			Object.keys(data).forEach((key) => {
 				const val = data[key]; 
				if (/^[0-9a-zA-Z]/.test(key)) { //이름은 영문/숫자만 허용
					this.appendXml(key, val === undefined ? null : val, dataEl);
				}
 			});
		} else {
			dataEl.appendChild(this._xmlDom.createTextNode(data+""));
   		}
   		
   		return this;
	}//end-appendXml
	///////////////////////////////////////////////////////

	///////////////////////////////////////////////////////
	// XML DOM 을 XML String으로 변환
	//-----------------------------------------------------
	toXmlString = () => {
		if (window.XMLSerializer) {
			return new XMLSerializer().serializeToString(this._xmlDom);
		} else {
			return this._xmlDom.xml;
		}
	}//end-toXmlString
	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //public 메서드
	//=========================================================================

	
		
		
	//=========================================================================
	// private 메서드
	//-------------------------------------------------------------------------
	///////////////////////////////////////////////////////
	// XML Document 생성
	//-----------------------------------------------------
	_instanceXmlDom = (xmlStr) => {
		let xmlDom;
		
		if (window.DOMParser) {
			xmlDom = new DOMParser().parseFromString(xmlStr, "text/xml");
			
		} else {
			xmlDom = new ActiveXObject("Microsoft.XMLDOM");
			xmlDom.async=false;
			xmlDom.loadXML(xmlStr);
		}
		
		return xmlDom;
	}//end-_instanceXmlDom
	///////////////////////////////////////////////////////
	//-------------------------------------------------------------------------
	// //private 메서드
	//=========================================================================

}//class XmlDoc
