import $ from 'jquery'
class FilmCore {

	constructor(opts) {

		this.$triggerDom = $('body');

		this.opts = Object.assign({
			studyId: '',
		}, opts);

		//数据格式
		this.data = [
			//胶片
			// {
			// 	//胶片参数
			// 	opts: {
			// 		width: '111mm',
			// 		height: '2111mm',
			// 		direction: 'verify',
			// 	},

			// 	//胶片数据
			// 	data: [
			// 		{
			// 			imageId:'id',
			// 			viewport: '',
			// 			toolStatus: '',
			// 			scaleRatio: 1
			// 		}
			// 	]

			// }
		];

		this.isRequest = false; //是否已经从服务端请求过数据
		this.activeMode = 1; //图像选择模式 1.胶片模式 2.图像模式 3.所有图像模式

	}

	/**
	 * 新建胶片
	 * @author w-bing
	 * @date 2020-04-07
	 * @param {Object} opts = {width = '', height = '', direction = 'vertical'} 新建胶片参数
	 * @returns {Object} 返回新建胶片数据
	 */
	addFilm(opts = {}){
		let film = {

			//胶片参数
			opts: {
				col: 1,
				row: 1,
				width: '',
				height: '',
				size: '',
				direction: 'vertical', //horizontal | vertical
				isVertical: false,
				sequenceReverse: false,
			},

			active: false, // 是否是激活的

			//胶片图像数据
			data: []

		};

		this.data.push(film);

		this.$triggerDom.trigger('onFilmAdd', {
			filmDatas: this.data,
			filmData: film
		});

		// let filmDefaultConf = layoutControls.getTemplateDefaultData(); //g.jun的默认模板配置

		let filmDefaultConf = {
			row: 2,
			col: 2,
			templateDirection: "胶片纵向",
			templateSize: '',
			width: 100,
			height: 100
		}

		let defaultFilmOpts = {
			row: filmDefaultConf.row,
			col: filmDefaultConf.col,
			direction: filmDefaultConf.templateDirection === '胶片纵向' ? 'vertical' : 'horizontal',
			size: filmDefaultConf.templateSize,
			width: filmDefaultConf.width,
			height: filmDefaultConf.height
		};
		opts = Object.assign(defaultFilmOpts, opts);
		this.setFilmOpts(film, opts);

		return film;

	}

	/**
	 * 根据索引值删除一个胶片
	 * @author w-bing
	 * @date 2020-04-07
	 * @param {Number} filmIndex 胶片索引ID
	 */
	removeFilm(filmIndex){

		this.data.splice(filmIndex, 1);

		this.$triggerDom.trigger('onFilmChange', {
			filmDatas: this.data
		});

		this.$triggerDom.trigger('onFilmRemove', {
			filmDatas: this.data
		});
	}

	/**
	 * 清空胶片
	 * @author w-bing
	 * @date 2020-04-07
	 */
	removeAllFilm(){

		this.data = [];
		cornerstoneTools.globalImageIdSpecificToolStateManager.removeAll();
		this.$triggerDom.trigger('onFilmChange', {
			filmDatas: this.data
		});

		this.$triggerDom.trigger('onFilmRemove', {
			filmDatas: this.data
		});
	}

	/**
	 * 激活一个胶片
	 * @author w-bing
	 * @date 2020-04-07
	 * @param {Number} filmIndex
	 * @param {String} from 给赵益用的一个类型参数,用于判断是来自新数据的 active 还是 单击序列列表的 active 操作
	 * @return {Promise} 给赵益那边用的，用于判断
	 */
	setActiveFilm(filmIndex){

		return new Promise((resolve, reject) => {

			// this.playerData2FilmData();//同步当前打开的数据

			this.data.forEach((film, index) => {

				if(index === filmIndex){

					film.active = true;
					this.$triggerDom.trigger('onFilmActive', {
						filmDatas: this.data,
						filmData: film,
						cb: resolve//所有acitive 工作都完成的事件
					});

				}else{

					if(film.active === true){
						film.active = false;
						this.$triggerDom.trigger('onFilmUnActive', {
							filmDatas: this.data,
							filmData: film,
						});
					}
					//补充
					reject('This is UnActive')
				}

			});

		});

	}

	/**
	 * 得到当前激活的film
	 * @author w-bing
	 * @date 2020-04-07
	 * @returns {Number|Object}
	 */
	getActiveFilm(){
		for(let i = 0; i < this.data.length; i++){
			if(this.data[i].active){
				return this.data[i];
			}
		}
		//是不是为了满足测试，都要把最后结果加在下面，return出去
		return false;
	}

	/**
	 * 获得激活胶片的索引值
	 * @author w-bing
	 * @date 2020-04-13
	 * @returns {any}
	 */
	getActiveFilmIndex(){
		let activeFilm = this.getActiveFilm();
		return activeFilm ? this.getFilmIndex(activeFilm) : false;
	}

	/**
	 * 获得一个胶片数据
	 * @author w-bing
	 * @date 2020-04-07
	 * @param {Number} filmIndex
	 * @return {Object|Boolean}
	 */
	getFilm(filmIndex){
		let film = this.data[filmIndex];
		return film ? film : false;
	}

	/**
	 * 获得胶片数据的索引值
	 * @author w-bing
	 * @date 2020-04-07
	 * @param {Object} filmData
	 * @returns {Number}
	 */
	getFilmIndex(filmData){
		return this.data.indexOf(filmData);
	}

	/**
	 * 设置胶片参数
	 * @author w-bing
	 * @date 2020-04-07
	 * @param {Object} opts
	 */
	setFilmOpts(filmData, opts){
		filmData.opts = Object.assign(filmData.opts, opts);
		this.$triggerDom.trigger('onSetFilmOpts', {
			filmDatas: this.data,
			filmData: filmData
		});
	}

	/**
	 * 给胶片添加一个图像
	 * @author w-bing
	 * @date 2020-04-07
	 * @param {Number} filmIndex
	 * @param {Object} data
	 */
	addFilmItem(filmIndex, {imageId = "", viewport = "", toolState = "", scaleRatio = 1, cornerInfo = "", cornerInfoStatus = ""} = {}, cover = false){

		let film = this.data[filmIndex];

		if(film){

			let filmItemData = {
				imageId,
				viewport,
				toolState,
				scaleRatio,
				cornerInfo,
				cornerInfoStatus,
			};
			film.data.push(filmItemData);

			this.$triggerDom.trigger('onFilmItemAdd', {
				cover,
				filmDatas: this.data,
				filmData: film,
				filmItemData: filmItemData
			});

			return filmItemData;
		}else{
			return false;
		}

	}

	removeFilmItem(filmIndex, itemIndex){

		this.$triggerDom.trigger('onFilmItemRemove', {
			filmDatas: this.data,
			filmData: film,
		});
	}

	/**
	 * 从服务端端获取数据
	 * @author w-bing
	 * @date 2020-04-09
	 * @returns {Promise}
	 */
	requestData(){

		// pop.loading(true);
		return new Promise((resolve, reject) => {

			$.ajax({
				type: 'POST',
				dataType: 'json',
				contentType: "application/json;charset=utf-8",
				url: config.interface.getFilmData,
				data: JSON.stringify({"checkserialnum": this.opts.studyId}),
			}).then(data => {

				if(data.code === '2000'){
					this.isRequest = true;
					if(data.data !== null){
						this.data = JSON.parse(data.data.filmData);
						this.baseData = $.extend(true, [], this.data);
					}
					resolve(data);
				}

			}).catch(err=>{
				reject(err)
			});

		});

	}

	/**
	 * 过滤掉胶片中的scale,active等影响判断胶片改变的数据
	 * @author w-bing
	 * @date 2020-05-22
	 * @param {Object} data
	 * @returns {Object}
	 */
	filterScaleData(data){

		data && data.forEach(item=>{
			delete item.active;
			delete item.opts.sequenceReverse;
			item.data.forEach(image=>{
				delete image.viewport.scale;
				if(typeof image.scaleRatio !== 'string'){
					image.scaleRatio = image.scaleRatio.toFixed(5);
				}
			})
		});
		return data;
	}

	/**
	 * 向服务端发送胶片数据
	 * @author w-bing
	 * @date 2020-04-09
	 * @param {any} flag
	 * @returns {Promise}
	 */
	sendData(flag){

		pop.loading(true);
		this.playerData2FilmData();//同步当前打开的数据
		return new Promise((resolve, reject) => {

			let _data = JSON.stringify({
				"checkserialnum": this.opts.studyId,
				"filmData": JSON.stringify(this.data),
				"flag": flag
			});

			$.ajax({
				type: 'POST',
				dataType: 'json',
				contentType: "application/json;charset=utf-8",
				url: config.interface.setFilmData,
				data: _data
			}).then(data => {

				setTimeout(() => {

					pop.loading(false, {cb: ()=>{

						this.isRequest = true;
						if(data.code === '2000'){
							this.baseData = $.extend(true, [], this.data);
							setTimeout(() => {
								pop.notice(parent.lang.langData.pop_dialog_film_notice_save_ok, {type: 'success'});
							}, 200);
							resolve(data);
						}

					}});

				}, 200);

			});

		});
	}

	/**
	 * filmData 转 playerData 数据
	 * @author w-bing
	 * @date 2020-04-09
	 * @param {Object} filmData
	 * @returns {Object}
	 */
	filmDataToPlayerData(filmData){
		let playerImages = [];
		let playerStatus = [];
		filmData.data.forEach(filmItem => {
			playerImages.push(filmItem.imageId);
			playerStatus.push({
				imageId: filmItem.imageId,
				viewport: filmItem.viewport,
				toolState: filmItem.toolState,
				scaleRatio: filmItem.scaleRatio,
				cornerInfo: filmItem.cornerInfo,
				cornerInfoStatus: filmItem.cornerInfoStatus
			});
		});
		return {
			studyId: 'film',
			seriesId: '',//没啥用
			data: playerImages,
			status: playerStatus
		};
	}

	/**
	 * 关闭前检测胶片数据，如果有修改，就提示是否保存
	 * @author w-bing
	 * @date 2020-04-14
	 * @param {Function} cb 成功回调
	 */
	closeCheck(cb){

		if($('.modal.confirm').length){
			return;
		}

		this.playerData2FilmData();//同步当前打开的数据

		let curData = this.filterScaleData($.extend(true, [], this.data));
		let baseData = this.filterScaleData(this.baseData);

		if(JSON.stringify(baseData) !== JSON.stringify(curData)){
			pop.confirm(parent.lang.langData.pop_dialog_film_close_confirm_text, status => {
				if(status){

					//暂存
					this.sendData(0).then(()=>{
						setTimeout(() => {
							cb();
						}, 1000);
					});

				}else{
					cb();
				}
			});
		}else{
			cb();
		}

	}

	/**
	 * 判断是否是空胶片(只要有一张胶片无图像，就算有空胶片)
	 * @author w-bing
	 * @date 2020-04-14
	 * @returns {any}
	 */
	isEmpty(){
		let isEmpty = false;
		this.data.forEach(item=>{
			if(!item.data.length){
				isEmpty = true;
			}
		})
		return isEmpty;
	}

	/**
	 * 更新显示当前胶片信息
	 * @author w-bing
	 * @date 2020-04-20
	 */
	displayActiveFilmInfo(){

		//viewer头部的统计信息国际化特殊处理
		let displayFilmInfo = () => {
			let activeFilmData = this.getActiveFilm();
			let viewerInfo = parent.lang.langData.viewer_film_info_text;
			viewerInfo = viewerInfo.replace('${0}', this.data.length);
			viewerInfo = viewerInfo.replace('${1}', activeFilmData.data.length);
			$('#viewer-top-info').text(viewerInfo);
		}

		displayFilmInfo();

		//国际化事件监听
		$('body').off('frameSetLang', 'viewerInfo');
		$('body').on('frameSetLang', evt=>{
			setTimeout(() => {
				displayFilmInfo();
			}, 50);
		}, 'viewerInfo');
	}

	/**
	 * 设置胶片操作模式
	 * @author w-bing
	 * @date 2020-04-20
	 * @param {Number} mode //图像选择模式 1.胶片模式 2.图像模式 3.所有图像模式
	 */
	setFilmActiveMode(mode = 1){

		let player = viewer.getAllPlayer2DBase()[0];
		player.setOptions({activeMode: mode === 2 ? 2 : 1});//只有图像模式才是2 ，胶片模式和全部图像模式都是

		this.activeMode = mode;

		if(mode === 3){

			let fn = (cb) => {
				this.data.forEach(filmItem=>{
					if(!filmItem.active){
						filmItem.data.forEach( image => {
							cb(image);
						});
					}
				});
			};

			let t = {};
			this.$triggerDom.off('onPlayerToolsEnd', 'filmcore');
			this.$triggerDom.on('onPlayerToolsEnd', (evt, data) => {

				clearTimeout(t[data.toolName])
				t[data.toolName] = setTimeout(() => {

					switch(data.toolName){
						case 'reset':
							fn(image => {
								image.viewport.translation.x = 0;
								image.viewport.translation.y = 0;
								image.viewport.hflip = false;
								image.viewport.vflip = false;
								image.viewport.invert = false;
								image.viewport.rotation = 0;
								image.viewport.voi.windowCenter = cornerstone.imageCache.imageCache[image.imageId].image.windowCenter;
								image.viewport.voi.windowWidth = cornerstone.imageCache.imageCache[image.imageId].image.windowWidth;
								image.scaleRatio = 1;
							});
							break;
						case 'wwwc':
							fn(image => {
								image.viewport.voi.windowCenter = data.render.imageStatus.viewport.voi.windowCenter;
								image.viewport.voi.windowWidth = data.render.imageStatus.viewport.voi.windowWidth;
							});
							break;
						case 'pan':
							fn(image => {
								image.viewport.translation.x = data.render.imageStatus.viewport.translation.x;
								image.viewport.translation.y = data.render.imageStatus.viewport.translation.y;
							});
							break;
						case 'scale':
							fn(image => {
								image.viewport.scale = data.render.imageStatus.viewport.scale;
								image.scaleRatio = data.render.imageStatus.scaleRatio;
							});
							break;
						case 'rotate':
							fn(image => {
								image.viewport.rotation += data.angle;
							});
							break;
						case 'flip':
							fn(image => {
								if(data.direct == 'h'){
									image.viewport.hflip = !image.viewport.hflip;
								}else{
									image.viewport.vflip = !image.viewport.vflip;
								}
							});
							break;
						case 'invert':
							fn(image => {
								image.viewport.invert = !image.viewport.invert;
							});
					}

				}, 50);

			}, 'filmcore');
		}else{
			this.$triggerDom.off('onPlayerToolsEnd', 'filmcore');
		}
	}

	/**
	 * 是否显示截屏UI模式
	 * @author w-bing
	 * @date 2020-05-11
	 * @param {Boolean} status=true
	 */
	displayScreenShotsMode(status = true){
		status ? $('body').addClass('screenshot') : $('body').removeClass('screenshot');
	}

	/**
	 * 当前 player 数据向当前 film 数据同步
	 * @author w-bing
	 * @date 2020-06-01
	 * @returns {any}
	 */
	playerData2FilmData(){

		let player = viewer.getAllPlayer2DBase()[0];
		if (!player.playerData) {
			return false;
		}

		let imageIds = player.playerData.data;
		let imageStatus = player.imageStatus;
		let filmData = this.getActiveFilm();

		if(!filmData){
			return false;
		}

		let newData = [];
		imageIds.forEach((imageId, i) => {

			newData.push({
				imageId,
				scaleRatio: imageStatus[i].scaleRatio,
				viewport: $.extend(true, {}, imageStatus[i].viewport), //JSON.parse(JSON.stringify(imageStatus[i].viewport)),
				toolState: $.extend(true, {}, imageStatus[i].toolState), //JSON.parse(JSON.stringify(imageStatus[i].toolState)),
				cornerInfo: $.extend(true, {}, imageStatus[i].cornerInfo), //JSON.parse(JSON.stringify(imageStatus[i].cornerInfo)),
				cornerInfoStatus: imageStatus[i].cornerInfoStatus
			});

		});

		filmData.data = newData;

	}

}

export default FilmCore;
