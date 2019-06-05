/**
 * 弹窗
 * 2017-12-22
 */
"use strict";
angular.module("modalDialogServiceModule", [
	"settingModule", //设置模块
	"newTopicPopupModule", //最新话题浮框
	"newTopicModalModule", //最新话题弹窗
	"emergencyPopupModule", //突发新闻浮框
	"emergencyModalModule" //突发新闻弹窗
]).
factory("modalDialogService", ["$rootScope", "homePageService", "$templateRequest", "$controller", "$timeout", "$compile", function($rootScope, homePageService, $templateRequest, $controller, $timeout, $compile) {
	return {
		/**
		 * [setting description] 设置弹窗
		 * @return {[type]} [description]
		 */
		setting: function(success, cancel) {
			window.setting = function(e) {
				if(event.keyCode === 27) {
					$templateRequest("./modalDialog/setting/setting_tpl.html").then(function(template) {
						var ctrlLocals = {};
						var dom = document.createElement("div");
						dom.innerHTML = template;
						ctrlLocals.$element = $(dom);
						ctrlLocals.success = success;
						ctrlLocals.cancel = cancel;
						ctrlLocals.$scope = $rootScope.$new();
						var ctrlInstance = $controller("settingCtri", ctrlLocals);
						dom = $compile(dom)(ctrlLocals.$scope);
						$("body").append(dom);
					});
				}
			};
			$("body").bind("keydown", setting);
		},
		/**
		 * [newTopicPopup description] 地图小浮框
		 * @return {[type]} [description]
		 */
		newTopicPopup: function(articleInfo, field, detail) {
			this.closeNewTopicPopup();
			this.closeEmergencyPopup();
			this.closeNewTopicModal();
			this.closeEmergencyModal();
			$templateRequest("./modalDialog/newTopicPopup/newTopicPopup_tpl.html").then(function(template) {
				var position = !!homePageService.mapData[field] ? homePageService.mapData[field] : homePageService.mapData[field + "市"];
				var newTopicPopupCtrl = {};
				newTopicPopupCtrl.sid = articleInfo.SID;
				newTopicPopupCtrl.$scope = $rootScope.$new();
				newTopicPopupCtrl.$scope.position = position.g;
				newTopicPopupCtrl.$scope.detail = detail;
				var ctrlInstance = $controller("newTopicPopupCtrl", newTopicPopupCtrl);
				var $template = $(template);
				$template = $compile($(template))(newTopicPopupCtrl.$scope);
				$(".m-mapbox").append($template);
				//小光点加入开始
				var img = new Image();
				img.src = "./images/circle_twinke.gif";
				$(img).addClass("mapPoint");
				$(img).css(position.g1);
				if(position.g1.left) {
					$(".m-mapbox").append(img);
				}
				//小光点加入结束
			});
		},
		/**
		 * [closeNewTopicPopup description] 关闭浮框
		 * @return {[type]} [description]
		 */
		closeNewTopicPopup: function() {
			var $popups = $(".m-newscont.wz");
			$popups.each(function() {
				$(this).data().$scope.$destroy();
				$(this).remove();
				$(".mapPoint").remove();
			});
		},
		/**
		 * [newTopicModal description] 最新话题弹窗
		 * @return {[type]} [description]
		 */
		newTopicModal: function(articleInfo, field, config, scrollEnd, isClose, close) {
			this.closeNewTopicPopup();
			this.closeEmergencyPopup();
			this.closeNewTopicModal();
			this.closeEmergencyModal();
			$templateRequest("./modalDialog/newTopicModal/newTopicModal_tpl.html").then(function(template) {
				var newTopicModalCtrl = {};
				var dom = document.createElement("div");
				dom.innerHTML = template;
				var $template = $(dom);
				newTopicModalCtrl.sid = articleInfo.SID;
				newTopicModalCtrl.scrollEnd = scrollEnd;
				newTopicModalCtrl.config = config;
				newTopicModalCtrl.$element = $template;
				newTopicModalCtrl.$scope = $rootScope.$new();
				newTopicModalCtrl.$scope.field = field;
				newTopicModalCtrl.$scope.isClose = isClose;
				newTopicModalCtrl.$scope.closeModal = close;
				var ctrlInstance = $controller("newTopicModalCtrl", newTopicModalCtrl);
				$template = $compile(dom)(newTopicModalCtrl.$scope);
				$(".m-mapbox").append($template);
			});
		},
		/**
		 * [closeNewTopicModal description] 关闭最新话题弹窗
		 * @return {[type]} [description]
		 */
		closeNewTopicModal: function() {
			var $modals = $(".m-txtcont");
			$modals.each(function() {
				$(this).data().$scope.$destroy();
				$(this).remove();
			});
		},
		/**
		 * [emergencyPopup description] 突发新闻小浮框
		 * @param {[type]} [varname] [description]
		 * @return {[type]} [description]
		 */
		emergencyPopup: function(articleInfo) {
			this.closeNewTopicPopup();
			this.closeEmergencyPopup();
			this.closeNewTopicModal();
			this.closeEmergencyModal();
			$templateRequest("./modalDialog/emergencyPopup/emergencyPopup_tpl.html").then(function(template) {
				var emergencyPopupCtrl = {};
				emergencyPopupCtrl.sid = articleInfo.SID;
				emergencyPopupCtrl.$scope = $rootScope.$new();
				var ctrlInstance = $controller("emergencyPopupCtrl", emergencyPopupCtrl);
				var $template = $(template);
				$template = $compile($(template))(emergencyPopupCtrl.$scope);
				$(".m-mapbox").append($template);
			});
		},
		/**
		 * [closeEmergencyPopup description]
		 * @return {[type]} [description]
		 */
		closeEmergencyPopup: function() {
			var $popups = $(".m-burstnews.burstnews-popup");
			$popups.each(function() {
				$(this).data().$scope.$destroy();
				$(this).remove();
			});
		},
		/**
		 * [emergencyModal description] 初始化状态弹窗
		 * @param {[type]} [varname] [description]
		 * @return {[type]} [description]
		 */
		emergencyModal: function(articleInfo, config, scrollEnd, isClose, close) {
			this.closeNewTopicPopup();
			this.closeEmergencyPopup();
			this.closeNewTopicModal();
			this.closeEmergencyModal();
			$templateRequest("./modalDialog/emergencyModal/emergencyModal_tpl.html").then(function(template) {
				var emergencyModalCtrl = {};
				var dom = document.createElement("div");
				dom.innerHTML = template;
				var $template = $(dom);
				emergencyModalCtrl.articleInfo = articleInfo;
				emergencyModalCtrl.scrollEnd = scrollEnd;
				emergencyModalCtrl.config = config;
				emergencyModalCtrl.$element = $template;
				emergencyModalCtrl.$scope = $rootScope.$new();
				emergencyModalCtrl.$scope.isClose = isClose;
				emergencyModalCtrl.$scope.closeModal = close;
				var ctrlInstance = $controller("emergencyModalCtrl", emergencyModalCtrl);
				$template = $compile(dom)(emergencyModalCtrl.$scope);
				$(".m-mapbox").append($template);
			});
		},
		/**
		 * [closeEmergencyModal description]
		 * @return {[type]} [description]
		 */
		closeEmergencyModal: function() {
			var $modals = $(".m-burstxtcont");
			$modals.each(function() {
				$(this).data().$scope.$destroy();
				$(this).remove();
			});
		}
	};
}]);