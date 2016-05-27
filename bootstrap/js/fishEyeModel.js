/**
 * Created by Administrator on 2016-5-27.
 */
define(["dojox/widget/FisheyeList",
        "dojox/widget/FisheyeListItem",
        "dojox/widget/DialogSimple",
        "esri/dijit/Measurement",
        "dijit/form/HorizontalSlider",
        "dijit/form/HorizontalRuleLabels",

        "dojo/on",
        "dojo/dom"],
    function (FisheyeList, FisheyeListItem, Dialog, Measurement, HorizontalSlider, HorizontalRuleLabels, on, dom) {
        return {
            startup: function (id, map) {
                //功能列表 start======//
                var fisheyeList = new FisheyeList({
                    id: "fisheyeList_id", itemWidth: 50
                    , itemHeight: 50
                    , itemMaxWidth: 200
                    , itemMaxHeight: 200
                    , orientation: "horizontal"
                    , effectUnits: 2
                    , itemPadding: 10
                    , attachEdge: "top"
                    , labelEdge: "bottom"
                });
                //测量功能 start ============//
                var rulerFishItem = new FisheyeListItem({
                    iconSrc: "images/ruler.png",
                    label: "测量工具",
                    id: "i_drawmeasure"
                });
                var funDialog;
                rulerFishItem.on("click", function (evt) {
                    if (!funDialog) {
                        funDialog = Dialog({
                            title: '测量',
                            style: 'width:260px',
                            content: "<div id='measurementDiv'></div>",
                            onHide: function (e) {
                                measurement.destroy();
                                funDialog.destroy();
                                funDialog = null;
                            }
                        });

                        funDialog.show();
                        var measurement = new Measurement({
                            map: map
                        }, dom.byId("measurementDiv"));

                        measurement.startup();
                        dijit._underlay.domNode.style.display = "none";//去掉dialog自带遮罩
                    } else {
                        funDialog.hide();
                    }
                });
                fisheyeList.addChild(rulerFishItem);// or  funbtn.placeAt(funBtnList);
                rulerFishItem.set("parent", fisheyeList);//设置parent 否则出错 鼠标放上去无法查看label

                // 图层透明控制 start ========//
                var opactiyFisheyeItem = new FisheyeListItem({iconSrc: "images/layers3.png", label: "透明控制"});
                fisheyeList.addChild(opactiyFisheyeItem);// or  funbtn.placeAt(funBtnList);
                opactiyFisheyeItem.set("parent", fisheyeList);//设置parent 否则出错 鼠标放上去无法查看label
                var opactiyFunDialog;
                opactiyFisheyeItem.on("click", function (evt) {
                    if (!opactiyFunDialog) {
                        opactiyFunDialog = Dialog({
                            title: '透明控制',
                            style: 'width:260px',
                            onHide: function (e) {
                                opactiyFunDialog.destroy();
                                opactiyFunDialog = null;
                            }
                        });
                        opactiyFunDialog.show();
                        var sliderObj = {
                            value: 1, minimum: 0,
                            maximum: 1,
                            discreteValues: 11,
                            intermediateChanges: true,
                            showButtons: true,
                            style: "width:240px;"
                        };
                        var layers = map.getLayersVisibleAtScale(map.getScale());
                        dojo.forEach(layers, function (o, i) {
                            var slider = new HorizontalSlider(sliderObj);
                            var labels = new HorizontalRuleLabels({
                                style: "height:1.5em;font-size:75%;color:gray;",
                                labels: [o.id]
                            });
                            slider.setAttribute("value", o.opacity);
                            labels.placeAt(slider);
                            slider.on("change", function (v) {
                                o.setOpacity(v);
                            });
                            slider.placeAt(opactiyFunDialog);
                        });
                        dijit._underlay.domNode.style.display = "none";//去掉dialog自带遮罩
                    } else {
                        opactiyFunDialog.hide();
                    }
                });
                fisheyeList.placeAt(id);
                fisheyeList.startup();
            }
        }
    });