d3.json("./data/people.json", function(json) {
    // 创建
    function GroupExplorer(wrapper,config){
        // 默认配置对象
        var defaultConfig = {
            data:{"nodes":[],"links":[]},
            // 初始宽高为视口宽高
            width:window.innerWidth * 0.7,
            height:window.innerHeight * 0.96,
            distance: 95
        };
        // jQuery库中的 ​$.extend()​方法，获取数据值
        $.extend(true,defaultConfig,config);
        
        // link里不是用名字匹配而是用数字（也就是对应对象的索引，即节点数组的顺序）
        // 检查是否存在名字，进行索引转换
        defaultConfig.data.links.forEach(function (e) {
            if(typeof e.source != "number" && typeof e.target != "number"){
                var sourceNode = defaultConfig.data.nodes.filter(function (n) {
                        return n.name === e.source;
                    })[0],
                    targetNode = defaultConfig.data.nodes.filter(function (n) {
                        return n.name === e.target;
                    })[0];
                e.source = sourceNode;
                e.target = targetNode;
            }
        });

        //d3画图start，首先初始化
        var _this = this,highlighted = null,dependsNode = [],dependsLinkAndText = [];
        
        // 将缩放变换应用到容器元素
        this.zoomed = function(){
            _this.vis.attr("transform", d3.event.transform);
        };
        // 设置缩放范围和缩放响应函数。
        var zoom = d3.zoom()
                .scaleExtent([0.2,10])
                .on("zoom",function(){
                    _this.zoomed();
                });
       
        // 选择body元素，并创建一个SVG画布，并应用缩放功能
        this.vis = d3.select(".network").append("svg:svg")
                .attr("width", defaultConfig.width)
                .attr("height", defaultConfig.height)
                // 实现双击还原
                .call(zoom).on("dblclick.zoom", null);
        // 分组元素，用于放置所有的节点、连接线和文字
        this.vis = this.vis.append('g').attr('class','all')
                .attr("width", defaultConfig.width)
                .attr("height", defaultConfig.height)

        // 创建力导向布局和力模型
        this.force = d3.forceSimulation()
                // 指定节点
                .nodes(defaultConfig.data.nodes)
                // 将连接线的力指定为 ​"link"​ 类型的力
                .force("link", d3.forceLink(defaultConfig.data.links).distance(defaultConfig.distance))
                .force("linkForce", d3.forceLink().id(function(d) { return d.id; }).distance(50))
                // 将节点之间的斥力指定为 ​"charge"​ 类型的力，创建一个斥力模型，用于模拟节点之间的互斥效应。
                .force("charge", d3.forceManyBody())
                // 将可视化的中心点设置为 ​(defaultConfig.width / 2, defaultConfig.height / 2)​。
                .force("center", d3.forceCenter(defaultConfig.width / 2, defaultConfig.height / 2))
                // 将碰撞力指定为 ​"collide"​ 类型的力。
                // 使节点保持至少 ​60​ 个单位的距离
                // 设置碰撞的强度为 0.2，使节点之间有一定的距离。​
                // .iterations(5)​ 设置迭代次数为 5，提高碰撞的精确度。
                .force("collide",d3.forceCollide(60).strength(0.2).iterations(5))
                .alphaTarget(1)
        
        // 创建箭头​<marker>​元素，之后可以使用该箭头标记在连接线的末端添加箭头效果。
        this.vis.append("svg:defs").selectAll("marker")
                // 绑定一个数据数组    
                .data(["end"])
                // 创建一个 ​<marker>​ 元素
                .enter().append("svg:marker")
                // 设置一个唯一的 ​id​ 属性
                .attr("id","arrow")
                // 类名为 ​'arrow'​，用于后续的CSS样式定义
                .attr('class','arrow')
                // 指定视图框(viewBox)，定义了在通过视图呈现时，元素起始点和围绕元素的盒子的属性
                .attr("viewBox", "0 -5 10 10")
                // 在X轴、Y轴方向上的参考点
                .attr("refX", 42)
                .attr("refY", 0)
                // 宽高
                .attr("markerWidth", 7)
                .attr("markerHeight", 12)
                .attr("markerUnits","userSpaceOnUse")
                .attr("orient", "auto")
                // 添加一个 ​<path>​ 元素，用于绘制箭头的路径
                .append("svg:path")
                // 设置路径命令
                .attr("d", "M0,-5L10,0L0,5")
                .attr('fill','#666');
        
        // 绘制连接线（link）并添加箭头标记
        this.link = this.vis.selectAll("line.link")
                .data(defaultConfig.data.links)
                .enter().append("svg:line")
                .attr("class", "link")
                .attr('stroke-width',1.8)
                // 获取起始点、目标点x,y
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; })
                .attr("stroke", function(d) {
                    if (d.value === "好友") {
                      return "#007175";  
                    } else {
                      return "gray";   // 其他关系为灰色或默认颜色
                    }
                  })
                .attr("marker-end", "url(#arrow)");

        // 重新计算力导向布局，并刷新可视化效果
        this.tick = function() {
            // 更新连接线的起始点 (x1, y1) 和终点 (x2, y2) 的位置
            _this.link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x})
                    .attr("y2", function(d) { return d.target.y;});
            _this.linetext.attr("x",function(d){ return (d.source.x + d.target.x) / 2})
                    .attr("y",function(d){ return (d.source.y + d.target.y) / 2});
            // 更新节点的位置
            _this.node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        };
        _this.force.on("tick", this.tick);

        // 处理节点的拖拽事件，并创建了一个用于节点拖拽的drag行为
        var dragstart = function(d, i) {
            console.info(d3.event.subject)
            _this.force.stop();
            // 阻止事件传播，以防止与其他事件冲突
            d3.event.sourceEvent.stopPropagation();
        };
        var dragmove = function(d, i) {
            d.px += d3.event.dx;
            d.py += d3.event.dy;
            d.x += d3.event.dx;
            d.y += d3.event.dy;
            // 重新计算力导向布局，并刷新可视化效果
            _this.tick();
        };
        var dragend = function(d, i) {
            d3.event.subject.fx = null;
            d3.event.subject.fy = null;
            // 重新启动力导向布局的运行
            _this.force.restart();
            _this.tick();
        };
        this.nodeDrag = d3.drag()
                .on("start", dragstart)
                .on("drag", dragmove)
                .on("end", dragend);


        // 高亮显示与指定对象相关的节点、连接线和文本，并取消其他元素的高亮显示
        this.highlightObject = function(obj) {
            if (obj) {
                // 获取要高亮显示的对象的索引
                var objIndex = obj.index;
                // 添加到依赖节点数组
                dependsNode = dependsNode.concat([objIndex]);
                // 添加到依赖连接线和文本数组
                dependsLinkAndText = dependsLinkAndText.concat([objIndex]);
                
                // 遍历连接线数据，确定与指定对象相关的节点索引，并添加到依赖节点数组中
                defaultConfig.data.links.forEach(function(lkItem) {
                    if (objIndex == lkItem['source']['index']) {
                        dependsNode = dependsNode.concat([lkItem.target.index])
                    } else if (objIndex == lkItem['target']['index']) {
                        dependsNode = dependsNode.concat([lkItem.source.index])
                    }
                });
                
                // 根据依赖节点数组设置节点样式为 "inactive"
                _this.node.classed('inactive', function(d) {
                    return dependsNode.indexOf(d.index) == -1;
                });
                
                // 根据依赖连接线和文本数组设置连接线样式为 "inactive"
                _this.link.classed('inactive', function(d) {
                    return dependsLinkAndText.indexOf(d.source.index) == -1 && dependsLinkAndText.indexOf(d.target.index) == -1;
                });
                
                // 根据依赖连接线和文本数组设置连线上的文本样式为 "inactive"
                _this.linetext.classed('inactive', function(d) {
                    return dependsLinkAndText.indexOf(d.source.index) == -1 && dependsLinkAndText.indexOf(d.target.index) == -1;
                });
            } else {
                // 如果未指定对象，则取消所有元素的高亮显示，将样式类 "inactive" 移除
                _this.node.classed('inactive', false);
                _this.link.classed('inactive', false);
                _this.linetext.classed('inactive', false);
            }
        };

        // 搜索框搜索
        var searchBox = document.getElementById('searchBox');
        searchBox.addEventListener('input', function() {
            var searchName = this.value.trim();
            if (searchName !== '') {
                // 每次搜索之前先还原
                dependsNode = dependsLinkAndText = [];
                _this.highlightObject(null);
                // 节点姓名匹配
                var matchedNode = defaultConfig.data.nodes.find(function(node) {
                    return node.name.toLowerCase() === searchName.toLowerCase();
                });
                _this.highlightObject(matchedNode);
            } else {
                _this.highlightObject(null);
            }
        });
        // 悬停框显示
        this.highlightToolTip = function(obj){
            if(obj){
                _this.tooltip.html("<div class='title'>" + obj.name + "的详情</div>" +
                                    "<table class='detail-info'><tr><td class='td-label'>字号：</td><td>" + obj.zihao + "</td></tr>" +
                                    "<tr><td class='td-label'>朝代：</td><td>" + obj.dynasty + "</td></tr>" +
                                    "<tr><td class='td-label'>年龄：</td><td>" + obj.age + "</td></tr>" +
                                    "<tr><td class='td-label'>称号：</td><td>" + obj.epithet + "</td></tr>" + 
                                    "<tr><td class='td-label'>事迹：</td><td>" + obj.deeds + "</td></tr>" +
                                    "<tr><td class='td-label'>代表作：</td><td>" + obj.famous + "</td></tr>" + 
                                    "<tr><td class='td-label'>链接：</td><td><a href='" + obj.link + "'>" + obj.name + "的主页</a></td></tr></table>")
                        .style("left",(d3.event.pageX+20)+"px")
                        .style("top",(d3.event.pageY-20)+"px")
                        .style("opacity",1.0);
            }else{
                _this.tooltip.style("opacity",0.0);
            }
        };
        this.tooltip = d3.select(".network").append("div")
                .attr("class","tooltip")
                .attr("opacity",0.0)
                .on('dblclick',function(){
                    // 被双击时，阻止提示框冒泡，避免影响其他事件。
                    d3.event.stopPropagation();
                })
                .on('mouseover',function(){
                    // 悬停时，如果之前设置了鼠标移出的定时器，则清除该定时器，以防止工具提示在短时间内被误隐藏
                    if (_this.node.mouseoutTimeout) {
                        clearTimeout(_this.node.mouseoutTimeout);
                        _this.node.mouseoutTimeout = null;
                    }
                })
                .on('mouseout',function(){
                    // 当鼠标移出工具提示时，如果之前设置了鼠标移出的定时器，则先清除该定时器。
                    // 然后，设置一个新的定时器
                    // 在快速移动鼠标时工具提示不会立即消失，只有在鼠标离开一段时间后才会隐藏。
                    if (_this.node.mouseoutTimeout) {
                        clearTimeout(_this.node.mouseoutTimeout);
                        _this.node.mouseoutTimeout = null;
                    }
                    _this.node.mouseoutTimeout=setTimeout(function() {
                        _this.highlightToolTip(null);
                    }, 300);
                });

        // 创建节点元素，并绑定相关的数据和事件处理函数
        this.node = this.vis.selectAll("g.node")
            .data(defaultConfig.data.nodes)
            .enter().append("svg:g")
            .attr("class", "node")
            .call(_this.nodeDrag)
            .on('mouseover', function(d) {
                // 鼠标悬停在节点上时，清除之前设置的鼠标移出的定时器，显示相应的工具提示
                if (_this.node.mouseoutTimeout) {
                    clearTimeout(_this.node.mouseoutTimeout);
                    _this.node.mouseoutTimeout = null;
                }
                _this.highlightToolTip(d);
            })
            .on('mouseout', function() {
                // 鼠标移出节点时，清除之前设置的鼠标移出的定时器，并设置一个新的定时器，在一定时间后隐藏工具提示
                if (_this.node.mouseoutTimeout) {
                    clearTimeout(_this.node.mouseoutTimeout);
                    _this.node.mouseoutTimeout = null;
                }
                _this.node.mouseoutTimeout=setTimeout(function() {
                    _this.highlightToolTip(null);
                }, 300);
            })
            .on('dblclick',function(d){
                // 双击节点时，高亮显示与当前节点相关的节点、连接线和连线上的文本，阻止事件冒泡
                _this.highlightObject(d);
                d3.event.stopPropagation();
            });

        // 在整个页面上绑定双击事件处理函数
        d3.select(".network").on('dblclick',function(){
            // 当双击页面其他区域时，取消所有节点、连接线和连线上的文本的高亮显示，并重置依赖节点和连接线数组
            dependsNode = dependsLinkAndText = [];
            _this.highlightObject(null);
            // 同时清空输入框
            d3.selectAll("#searchBox").property("value", "");
        });

        // 为每个节点添加图片元素表示节点图标
        this.node.append("svg:image")
            .data(defaultConfig.data.nodes)
            .attr("class", "circle")
            .attr("xlink:href", function(d){ return("./assects/images/" + d.image)}) // 图片链接地址
            .attr("x", "-25px") // 图片相对于节点位置的水平偏移量
            .attr("y", "-25px") // 图片相对于节点位置的垂直偏移量
            .attr("width", "50px") // 图片的宽度
            .attr("height", "50px"); // 图片的高度
            
        // 为每条连线添加文本元素表示连线的关系描述
        this.linetext = this.vis.selectAll('.linetext')
            .data(defaultConfig.data.links)
            .enter()
            .append("text")
            .attr("class", "linetext")
            .attr("x", function(d){ return (d.source.x + d.target.x) / 2}) // 文本的水平位置为连线起点和终点x坐标的中间值
            .attr("y", function(d){ return (d.source.y + d.target.y) / 2}) // 文本的垂直位置为连线起点和终点y坐标的中间值
            .text(function (d) { 
                if (d.value !== "好友") {
                    return d.value; 
                } else {
                    return ""; 
                }
                // return d.value;
            })
            .call(d3.drag()) // 添加拖拽行为，使文本可以被拖动
            .style("font-family", "KaiTi, serif") 
            .style("font-size", "14px")
    }
    // 实例应用
    new GroupExplorer('.network',{
        data:json
    });
});