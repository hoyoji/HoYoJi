( function() {
		exports.extendsMe = function($, attrs) {
			Alloy.Globals.extendsBaseUIController($, attrs);

			exports.dirtyCB = function() {
				if ($.saveableMode !== "read") {
					$.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
					$.menuButton.setBackgroundColor("yellow");
					$.menuButton.setEnabled(true);
					console.info("titlebar dirtyCB");
				}
			};

			exports.cleanCB = function() {
				if ($.saveableMode !== "read") {
					$.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
					$.menuButton.setBackgroundColor("white");
					$.menuButton.setEnabled(false);
					console.info("titlebar cleanCB");
				}
			};

			exports.saveStartCB = function() {
				$.menuButton.setTitle($.$attrs.savingModeMenuButtonTitle || "saving");
				$.menuButton.setEnabled(false);
				$.backButton.setEnabled(false);
			};
			exports.saveEndCB = function() {
				exports.cleanCB();
				showMsg("保存成功");
				console.info("Titlebar saveEndCB");

				$.menuButton.setEnabled(false);
				$.backButton.setEnabled(true);
			};
			exports.saveErrorCB = function() {
				showMsg("出错啦...");
				console.info("Titlebar saveErrorCB");

				$.menuButton.setTitle($.$attrs.editModeMenuButtonTitle || "保存");
				$.menuButton.setEnabled(true);
				$.backButton.setEnabled(true);
			};
			var showMsg = function(msg) {
				var animation = Titanium.UI.createAnimation();
				animation.top = "0";
				animation.duration = 300;
				animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
				animation.addEventListener('complete', function() {
					setTimeout(function() {
						var animation = Titanium.UI.createAnimation();
						animation.top = "-42";
						animation.duration = 300;
						animation.curve = Titanium.UI.ANIMATION_CURVE_EASE_OUT;
						animation.addEventListener('complete', function() {
							$.title.show();
						});

						$.msg.animate(animation);
					}, 1500);
				});

				$.msg.setText(msg);
				$.title.hide();
				$.msg.animate(animation);
			};
			$.onWindowOpenDo(function() {
				$.widget.fireEvent("registerdirtycallback", {
					bubbles : true,
					onBecameDirtyCB : $.dirtyCB,
					onBecameCleanCB : $.cleanCB
				});
			});

			$.saveButton.addEventListener('singletap', function(e) {
				e.cancelBubble = true;
				$.saveButton.fireEvent("save", {
					bubbles : true,
					sourceController : exports
				});
			});

		};
	}());
