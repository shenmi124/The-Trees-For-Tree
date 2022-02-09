addLayer("p", {
    name: "prestige",
    symbol: "P",
    position: 10,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "rgb(49,174,176)",
    requires(){return new Decimal(10)},
    resource: "声望",
    baseResource: "通量点",
    baseAmount() {return player.points},
    type: "normal",
    exponent:function(){
		let exp = new Decimal(0.5)
		return exp
	},
    gainMult() {
        mult = new Decimal(1)
		if(hasUpgrade("a",13)){mult = mult.times(upgradeEffect("a",13))}
		if(hasUpgrade("a",14)){mult = mult.times(upgradeEffect("a",14))}
		if(hasUpgrade("p",31)){mult = mult.times(upgradeEffect("p",31))}
		if(hasUpgrade("p",41)){mult = mult.times(upgradeEffect("p",41))}
		if(hasUpgrade("p",42)){mult = mult.times(upgradeEffect("p",42))}
		if(hasUpgrade("p",43)){mult = mult.times(upgradeEffect("p",43))}
		if(hasUpgrade("p",44)){mult = mult.times(upgradeEffect("p",44))}
		if(hasChallenge("am",11)){mult = mult.times(player.am.eff11)}
		if(inChallenge("am",12)){mult = mult.pow(0.1)}
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    hotkeys: [
        {key: "p", description: "P: 重置声望树的P层", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	update(diff) {
		generatePoints("p", this.revenue(diff))
	},
    layerShown(){return true},
		doReset(resettingLayer) {
			if (layers[resettingLayer].row > layers[this.layer].row) {
				let keep = []
				if (resettingLayer=="c" && hasMilestone("c",3)) keep.push("points","base","total","milestones","upgrades");
				if (resettingLayer=="e" && hasMilestone("e",2)) keep.push("points","base","total","milestones","upgrades");
				if (resettingLayer=="am" && hasUpgrade("am",12)) keep.push("points","base","total","milestones","upgrades");
				if (resettingLayer=="amo" && hasMilestone("amo",0)) keep.push("points","base","total","milestones","upgrades");
				layerDataReset(this.layer, keep)
			}
			player.a.fire = new Decimal(100)
		},
		upgrades: {
			11: {
				title: "开始",
				description: "有些熟悉<br>亦或者不是<br>每秒获得1点数",
				cost:function(){return new Decimal("0")},
				effect(){
					let eff = new Decimal(1)
					if(hasMilestone("c",0)){eff = eff.mul(10)}
					if(hasMilestone("e",0)){eff = eff.mul(2)}
					return eff
				},
				currencyDisplayName:"通量点",
				currencyInternalName: "points",
				effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id)) }, 
			},
			12: {
				title: "声望增益",
				description: "声望加成点数获取.",
				cost:function(){return new Decimal("1")},
				effect(){
					let eff = player.p.points.add(2).pow(0.5)
					eff = softcap(eff,new Decimal(1e5),0.1)
					return eff
				},
				effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"×" }, 
				unlocked(){return hasUpgrade("p",11)},
			},
			13: {
				title: "自协同",
				description: "点数加成点数获取.",
				cost:function(){return new Decimal("3")},
				effect(){
					let eff = player.points.add(1).log10().pow(0.75).add(2)
					if(hasUpgrade("p",22)){eff = eff.mul(upgradeEffect("p",22))}
					return eff
				},
				effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"×" }, 
				unlocked(){return hasUpgrade("p",12)},
			},
			14: {
				title: "己协同",
				description: "声望加成声...等等,B,G层是认真的吗?<br>那太没意思了,不如买些DLC",
				cost:function(){return new Decimal("9")},
				effect(){
					let eff = new Decimal("0")
					if(hasUpgrade("p",14)){eff = new Decimal(4)}
					return eff
				},
				effectDisplay() { return "+"+format(upgradeEffect(this.layer, this.id))+"DLC" }, 
				unlocked(){return hasUpgrade("p",13)},
			},
			21: {
				title: "反转声望增益",
				description: "声望加成点数获取.",
				cost:function(){return new Decimal("5000")},
				effect(){
					let eff = player.p.points.add(1).log10().cbrt().add(3)
					return eff
				},
				effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"×" }, 
				unlocked(){return hasUpgrade("a",23)},
			},
			22: {
				title: "协同协同",
				description: "自协同和己协同(迟到的己协同)的效果互相相乘后的0.1次方后log8+1再相乘",
				cost:function(){return new Decimal("10000")},
				unlocked(){return hasUpgrade("a",23)},
				effect(){
					let eff = new Decimal(1).mul(upgradeEffect("p",13)).mul(upgradeEffect("a",13)).pow(0.1).log(8).add(1)
					eff = softcap(eff,new Decimal(2),0.1)
					return eff
				},
				effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"×" }, 
			},
			23: {
				title: "威望增量",
				description: "点数获取除以10,但是每秒自动获得10%的威望",
				cost:function(){return new Decimal("26851")},
				unlocked(){return hasUpgrade("a",23)},
				effect(){
					let eff = new Decimal(10)
					return eff
				},
				effectDisplay() { return "/"+format(upgradeEffect(this.layer, this.id)) }, 
			},
			24: {
				title: "威望平衡",
				description: "与前者第一个效果相反",
				cost:function(){return new Decimal("12895")},
				unlocked(){return hasUpgrade("p",23)},
				effect(){
					let eff = new Decimal(10)
					return eff
				},
				effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id)) }, 
			},
			31: {
				title: "我们需要更多声望",
				description: "声望获取提升至 1.05 次幂.",
				cost:function(){return new Decimal("56789")},
				unlocked(){return hasUpgrade("a",24)},
				effect(){
					let eff = new Decimal(1.05)
					return eff
				},
				effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id)) }, 
			},
			32: {
				title: "我们不需要更多点数",
				description: "点数获取提升至 0.975 次幂.但是每秒再自动获得90%声望",
				cost:function(){return new Decimal("123456")},
				unlocked(){return hasUpgrade("a",24)},
				effect(){
					let eff = new Decimal(0.975)
					return eff
				},
				effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id),3) }, 
			},
			33: {
				title: "力量升级",
				description: "通量点获取基于你已购买的声望升级更快.",
				cost:function(){return new Decimal("654321")},
				unlocked(){return hasUpgrade("a",24)},
				effect(){
					let eff = new Decimal.pow(1.4, player.p.upgrades.length)
					if(hasUpgrade("p",34)){eff = eff.pow(upgradeEffect("p",34))}
					return eff
				},
				effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id)) }, 
			},
			34: {
				title: "仍然无用",
				description: "平方声望升级'力量升级'效果.",
				cost:function(){return new Decimal("123456789")},
				unlocked(){return hasUpgrade("a",24)},
				effect(){
					let eff = new Decimal(2)
					return eff
				},
				effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id)) }, 
			},
			41: {
				title: "高级协同I",
				description: "灰烬增加声望获取.",
				cost:function(){return new Decimal("1e36")},
				unlocked(){return hasUpgrade("am",15)},
				effect(){
					let eff = player.a.points.add(1).log(10).add(1)
					return eff
				},
				effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id)) }, 
			},
			42: {
				title: "高级协同II",
				description: "煤增加声望获取.",
				cost:function(){return new Decimal("1e38")},
				unlocked(){return hasUpgrade("am",15)},
				effect(){
					let eff = player.c.points.add(1)
					return eff
				},
				effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id)) }, 
			},
			43: {
				title: "高级协同III",
				description: "电力增加声望获取.",
				cost:function(){return new Decimal("1e40")},
				unlocked(){return hasUpgrade("am",15)},
				effect(){
					let eff = player.e.points.add(1).log(5).add(1)
					return eff
				},
				effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id)) }, 
			},
			44: {
				title: "高级协同IV",
				description: "增量增加声望获取.",
				cost:function(){return new Decimal("1e42")},
				unlocked(){return hasUpgrade("am",15)},
				effect(){
					let eff = player.i.points.add(1).log(10).add(1)
					return eff
				},
				effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id)) }, 
			},
			81: {
				title: "新DLC",
				description: "在你的'通量点'上再加排字?",
				cost:function(){
					let cost = new Decimal("10")
					return cost
				},
				unlocked(){return hasUpgrade("p",14)},
			},
			82: {
				title: "新DLC",
				description: "给你的'通量点'再加点效果?",
				cost:function(){
					let cost = new Decimal("1e10")
					return cost
				},
				unlocked(){return hasUpgrade("p",14)},
			},
			83: {
				title: "新DLC",
				description: "给你的'通量点'建立一个王国系统?",
				cost:function(){
					let cost = new Decimal("1e100")
					return cost
				},
				unlocked(){return hasUpgrade("p",14)},
			},
			84: {
				title: "新DLC",
				description: "给你的'通量点'再加点RPG风味?",
				cost:function(){
					let cost = new Decimal("1e1000")
					return cost
				},
				unlocked(){return hasUpgrade("p",14)},
			},
		},
		revenue(diff) {
			let pu = 0
			if (hasUpgrade("p",23)){pu += 10}
			if (hasUpgrade("p",32)){pu += 90}
			return diff * pu / 100
		},    
	tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", function() {return '你有 ' + format(player.points) + ' 通量点.'}],
        "blank",
        "upgrades"
    ]
})

addLayer("a", {
    startData() { return {
		unlocked: false,
		points:new Decimal(0),
		fire:new Decimal(100),
		fire_timer:new Decimal(1),
    }},
    color: "#444444",
    resource: "灰烬",
	position: 9,
    row: 1,
    baseResource: "通量点",
    baseAmount() {
        return player.points
    },
    requires:function(){
		let req = new Decimal(10)
		if(hasMilestone("c",0)){req = req.sub(2)}
		if(player.a.points.eq(0) && !hasUpgrade("a",11)){req = req.mul(0.5)}
		return req
	},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        let mult = new Decimal(1).mul(Decimal.add(player.a.fire).div(100).mul(upgradeEffect("a",12)))
		mult = mult.mul(tmp.c.effect)
        if(hasUpgrade(this.layer, 21)){mult = mult.mul(upgradeEffect(this.layer, 21))}
        if(hasUpgrade(this.layer, 13)){mult = mult.mul(upgradeEffect(this.layer, 13))}
		if(hasUpgrade(this.layer, 42)){mult = mult.mul(upgradeEffect(this.layer, 42))}
        if(hasUpgrade("c", 11)){mult = mult.mul(upgradeEffect("c", 11))}
        if(player["e"].unlocked) {mult = mult.mul(player["e"].allocatedEffects[1])}
		if(hasMilestone("c",4)){mult = Decimal.max(mult,2000)}
        return mult
    },
    gainExp() {
        let exp = new Decimal(1)
        return exp
    },
    layerShown() {return hasUpgrade("p",81)},
	update(diff){
		var allocatedEffects0 = player["e"].unlocked ? player["e"].allocatedEffects[0]:"1"
		player.a.fire_timer = player.a.fire_timer.sub(Decimal.add(1).mul(diff))
		if(player.a.fire_timer.lte(0)){
			player.a.fire_timer = new Decimal(1)
			let getfire = new Decimal(0).add(Math.floor(Math.random() * 100) + 1)
			if(getfire.lte(Decimal.add(45).mul(upgradeEffect("a",32))) && hasUpgrade("a",31)){player.a.fire = player.a.fire.add(Decimal.add(10).mul(upgradeEffect("a",32)))}
		}
		if(player.a.fire.gt(0)){player.a.fire = player.a.fire.sub(Decimal.add(40).div(upgradeEffect("a",11)).div(upgradeEffect("a",22)).div(allocatedEffects0).mul(player.a.fire.sub(100).mul(0.15).mul(upgradeEffect("a",33)).mul(upgradeEffect("a",34)).max(1)).mul(player.a.fire.sub(1000).mul(15).mul(upgradeEffect("a",33)).mul(upgradeEffect("a",34)).max(1)).mul(diff))}
		if(player.a.fire.lt(0))(player.a.fire = new Decimal(0))
		generatePoints("a", this.revenue(diff))
	},
    hotkeys: [{key: "a",description: "A: 重置燃烧树的A层",onPress(){if (player["a"].unlocked) doReset("a")}}],
		doReset(resettingLayer) {
			if (layers[resettingLayer].row > layers[this.layer].row) {
				let keep = []
				if (resettingLayer=="am" && hasUpgrade("am",12)) keep.push("points","base","total","milestones","upgrades");
				layerDataReset(this.layer, keep)
			}
			player.a.fire = new Decimal(100)
		},
		upgrades: {
			11: {
				title: "火焰以一半的速度失去强度",
				description: "有些熟悉...?",
				cost:function(){return new Decimal("1")},
				effect(){
					let eff = new Decimal(1)
					if(hasUpgrade("a",11)){eff = new Decimal(2)}
					return eff
				},
				effectDisplay() { return "/"+format(upgradeEffect(this.layer, this.id)) }, 
			},
			12: {
				title: "想起来这是什么了吗?",
				description: "根据你的灰烬,火焰的效果会更强.",
				cost:function(){return new Decimal("5")},
				effect(){
					let eff = new Decimal(1)
					if(hasUpgrade("a",12)){eff = new Decimal(player[this.layer].points.add(2).log(10).add(1))}
					return eff
				},
				effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id)) }, 
				unlocked(){return hasUpgrade("a",11)},
			},
			13: {
				title: "迟到的己协同",
				description: "根据你的灰烬,获得更多声望点.",
				cost:function(){return new Decimal("15")},
				effect(){
					let eff = new Decimal(player.a.points.add(1).log(3).add(1))
					if(hasUpgrade("p",22)){eff = eff.mul(upgradeEffect("p",22))}
					return eff
				},
				effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id)) }, 
				unlocked(){return hasUpgrade("a",12)},
			},
			14: {
				title: "声望递归",
				description: "声望加成声望获取.",
				cost:function(){return new Decimal("150")},
				effect(){
					let eff = new Decimal.add(player.p.points.plus(1).pow(0.083).log(38).pow(0.38).pow(3.8).add(1));
					return eff
				},
				effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id)) }, 
				unlocked(){return hasMilestone("c",1) && hasUpgrade("a",12)},
			},
			21: {
				title: "这是:",
				description: "火焰现在会影响你的灰烬...呃,不对<br>火焰强度现在会影响你的通量点增益.",
				cost:function(){return new Decimal("115")},
				effect(){
					let eff = new Decimal(player.a.fire.add(1))
					if(hasUpgrade("c",12)){eff = eff.mul(upgradeEffect("c",12))}
					return eff
				},
				effectDisplay() { return "*"+format(upgradeEffect(this.layer, this.id)) }, 
				unlocked(){return hasUpgrade("a",13)},
			},
			22: {
				title: "燃烧树!",
				description: "根据你的灰烬,火焰失去力量的速度较慢.",
				cost:function(){return new Decimal("2.5e6")},
				effect(){
					let eff = new Decimal(1)
					if(hasUpgrade("a",22)){eff = new Decimal(player[this.layer].points.add(1).log(10).div(player[this.layer].points.add(1).log(10).add(10)).add(1).mul(2).sub(1))}
					return eff
				},
				effectDisplay() { return "/"+format(upgradeEffect(this.layer, this.id)) }, 
				unlocked(){return hasUpgrade("a",21)},
			},
			23: {
				title: "声望树重置!",
				description: "解锁一排新的声望升级",
				cost:function(){return new Decimal("5e6")},
				unlocked(){return hasUpgrade("a",22)},
			},
			24: {
				title: "声望树经典(并不经典)",
				description: "再解锁一排新的声望升级",
				cost:function(){return new Decimal("2e8")},
				unlocked(){return hasMilestone("c",1) && hasUpgrade("a",23)},
			},
			31: {
				title: "一蹦一跳真可爱",
				description: "每秒有45%的概率增加10%的火焰强度(或许能超过100%)",
				cost:function(){return new Decimal("1e7")},
				unlocked(){return hasUpgrade("a",23)},
			},
			32: {
				title: "真正的在燃烧的树",
				description: "前一个升级的概率和增加强度翻倍",
				cost:function(){return new Decimal("2e7")},
				effect(){
					let eff = new Decimal(1)
					if(hasUpgrade("a",32)){eff = new Decimal(2)}
					return eff
				},
				unlocked(){return hasUpgrade("a",31)},
			},
			33: {
				title: "突破界限",
				description: "火焰强度超过100%的格外损失速度减缓",
				cost:function(){return new Decimal("1e20")},
				effect(){
					let eff = new Decimal(1)
					if(hasUpgrade("a",33)){eff = new Decimal(0.1)}
					return eff
				},
				unlocked(){return hasUpgrade("a",32)},
			},
			34: {
				title: "超越法度",
				description: "火焰强度超过100%的格外损失速度减缓,再一次",
				cost:function(){return new Decimal("1e30")},
				effect(){
					let eff = new Decimal(1)
					if(hasUpgrade("a",33)){eff = new Decimal(0.1)}
					return eff
				},
				unlocked(){return hasMilestone("c",1) && hasUpgrade("a",33)},
			},
			41: {
				title: "熔炉",
				description: "火焰进一步提升通量点获取.",
				cost: new Decimal(1e9),
				effect() {
					return player.a.fire.mul(450).sqrt().add(1)
				},
				effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x"},
				unlocked() {return hasUpgrade("a", 31) && hasMilestone("e", 1)}
			},
			42: {
				title: "高炉",
				description: "火焰提升灰烬获取.",
				cost: new Decimal(1e12),
				effect() {
					return player.a.fire.div(4000).sqrt().add(1)
				},
				effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x"},
				unlocked() {return hasUpgrade("a", 32) && hasMilestone("e", 1)}
			},
			43: {
				title: "电磁炉",
				description: "第二个电池效果2.5倍.",
				cost: new Decimal(1e22),
				effect() {
					let eff = new Decimal(1)
					if(hasUpgrade("a",43)){eff = new Decimal(2.5)}
					return eff
				},
				unlocked() {return hasUpgrade("a", 33) && hasMilestone("e", 1)}
			},
			44: {
				title: "C,E升级的交点",
				description: "CE层的耗费变成还未解锁的样子",
				cost: new Decimal(1e36),
				effect() {
					let eff = new Decimal(1)
					if(hasUpgrade("a",43)){eff = new Decimal(2.5)}
					return eff
				},
				unlocked() {return hasUpgrade("a", 34) && hasUpgrade("a", 43)}
			},
			91: {
				title: "揭露",
				description: "发现燃烧树中隐藏的东西",
				cost: new Decimal("1.79e308"),
				unlocked() {return hasUpgrade("a", 44)},
				style() {return {'height': "200px",'width': '200px'}},
			},
		},
		revenue(diff) {
			let au = 0
			if (hasUpgrade("p",81) && hasMilestone("c",0)){au += 5}
			if (hasUpgrade("p",81) && hasMilestone("e",0)){au += 5}
			return diff * au / 100
		},    
    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", function() {return '你有 ' + format(player.points) + ' 通量点.'}],
        "blank",
		["display-text", function() {return '很明显火焰强度并不能改变通量点的获取,所以,它被赋予了新的效果,获得灰烬!'}],
		["display-text", function() {return hasUpgrade('a',31) ? '你的火焰强度太高了,当它超过100%时会损失的越来越快' : ''}],
		["display-text", function() {return hasUpgrade('a',34) ? '你的火焰强度太太高了,当它超过1000%时会损失的更加越来越快' : ''}],
		["display-text", function() {return hasUpgrade("a",11) ? '' : '第一个升级或许不是很好完成,所以在获得第一个升级前第一个灰烬获取更容易'}],
		"blank",
        "upgrades"
    ]
})

addLayer("i", {
    name: "增量",
    symbol: "I",
    position: 11,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		getpoints: new Decimal(0),
		allbuy:new Decimal(0),
    }},
    color: "rgb(75,76,131)",
    requires: new Decimal(10),
    resource: "增量",
    baseResource: "通量点",
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.5,
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
	update(diff) {
		player.i.getpoints = new Decimal(player.points.add(2).log(10).mul(upgradeEffect("c",14)).mul(upgradeEffect("i",12)).mul(buyableEffect("i",11)).mul(buyableEffect("i",12)).mul(tmp.am.effect).mul(tmp.amo.effect[0]).mul(upgradeEffect("am",11)).mul(upgradeEffect("am",12)).mul(upgradeEffect("am",13)).pow(buyableEffect("i",13)))
		player.i.allbuy = new Decimal(0).add(getBuyableAmount("i",11)).add(getBuyableAmount("i",12)).add(getBuyableAmount("i",13))
		if(hasUpgrade("p",82) || hasMilestone("amo",0)){player.i.points = player.i.points.add(Decimal.add(player.i.getpoints).mul(diff))}
	},
		doReset(resettingLayer) {
			if (layers[resettingLayer].row > layers[this.layer].row) {
				let keep = []
				if (resettingLayer=="c" && hasUpgrade("am",13)) keep.push("points","base","milestones","upgrades","buyables");
				if (resettingLayer=="e" && hasUpgrade("am",13)) keep.push("points","base","milestones","upgrades","buyables");
				layerDataReset(this.layer, keep)
			}
			player.a.fire = new Decimal(100)
		},
		upgrades: {
			11: {
				title: "这个效果有点弱?",
				description: "增量数量增加通量点获得量",
				cost:function(){return new Decimal("222")},
				effect(){
					let eff = new Decimal(0)
					if(hasUpgrade("i",11)){eff = new Decimal(1).mul(player.i.points.mul(0.01))}
					if(hasUpgrade("i",21)){eff = new Decimal(1).mul(player.i.points.mul(0.1)).add(1)}
					eff = softcap(eff,new Decimal(1e10),0.5)
					return eff
				},
				effectDisplay() { return hasUpgrade("i",21) ? format(upgradeEffect(this.layer, this.id))+"×" : "+"+format(upgradeEffect(this.layer, this.id)) }, 
			},
			12: {
				title: "添加断臂",
				description: "解锁第一个可重复购买项，每购一个增量的升级，增量获得量乘 1.1(复加)",
				cost:function(){return new Decimal("2222")},
				unlocked(){
                    return hasUpgrade("i",11)
				},
				effect(){
					let eff = 1
					if(hasUpgrade("i",12)){eff = new Decimal(1).mul(player.i.upgrades.length * 0.1).add(1)}
					return eff
				},
				effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"×" }, 
			},
			13: {
				title: "添加'添加断臂'",
				description: "解锁第二个可重复购买项",
				cost:function(){return new Decimal("22222")},
				unlocked(){
				  return hasUpgrade("i",12)
				}
			},
			14: {
				title: "添加'添加'添加断臂''",
				description: "解锁第三个可重复购买项",
				cost:function(){return new Decimal("222222")},
				unlocked(){
				  return hasUpgrade("i",13)
				}
			},
			21: {
				title: "这个效果不太弱?",
				description: "'这个效果有点弱?'效果十倍并且加成从加变为乘(带1保底)",
				cost:function(){return new Decimal("2222222")},
				unlocked(){
				  return hasUpgrade("i",14)
				}
			},
			22: {
				title: "速度药水",
				description: "延缓'增量速度'价格的线性增长",
				cost:function(){return new Decimal("2.22e22")},
				unlocked(){
				  return hasUpgrade("i",21)
				},
				effect(){
					let eff = new Decimal(0)
					if(hasUpgrade("i",22)){eff = new Decimal(0.48)}
					return eff
				}
			},
			23: {
				title: "力量药水",
				description: "移除'增量强度'价格的线性增长",
				cost:function(){return new Decimal("2.22e222")},
				unlocked(){
				  return hasUpgrade("i",22)
				},
				effect(){
					let eff = new Decimal(0)
					if(hasUpgrade("i",23)){eff = new Decimal(3)}
					return eff
				}
			},
			24: {
				title: "这是什么药水?",
				description: "移除'增量强度'价格的线性增长",
				cost:function(){return new Decimal("1.79e308")},
				unlocked(){
				  return hasUpgrade("i",23)
				},
				effect(){
					let eff = new Decimal(0)
					if(hasUpgrade("i",24)){eff = new Decimal(1)}
					return eff
				}
			},
		},
		buyables: {
			11: {
                cost(x){
					let a = new Decimal("1.98").sub(upgradeEffect("i",22))
					return new Decimal("10").mul(Decimal.add(a).pow(x)).mul(Decimal.add(1.01).pow(Decimal.add(x).pow(2)))
                },
				title:"增量速度",
				display() { return "数量:"+format(getBuyableAmount(this.layer, this.id))+"<br>目前:×"+format(buyableEffect(this.layer, this.id))+"<br>价格:"+format(this.cost())},
				canAfford() { return player[this.layer].points.gte(this.cost()) },
				buy() {
					player[this.layer].points = player[this.layer].points.sub(this.cost())
					setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
				},
				unlocked(){return hasUpgrade("i",12)},
				effect(x){
					let eff = new Decimal(1.65).pow(x)
					eff = softcap(eff,new Decimal(1e8),0.15)
					return eff
				}
			},
			12: {
                cost(x){
					let a = new Decimal("4").sub(upgradeEffect("i",23))
					return new Decimal("100").mul(Decimal.add(a).pow(x)).mul(Decimal.add(1.25).pow(Decimal.add(x).pow(2)))
                },
				title:"增量强度",
				display() { return "数量:"+format(getBuyableAmount(this.layer, this.id))+"<br>目前:×"+format(buyableEffect(this.layer, this.id))+"<br>价格:"+format(this.cost())},
				canAfford() { return player[this.layer].points.gte(this.cost()) },
				buy() {
					player[this.layer].points = player[this.layer].points.sub(this.cost())
					setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
				},
				unlocked(){return hasUpgrade("i",13)},
				effect(x){
					let eff = new Decimal(2).pow(x)
					return eff
				}
			},
			13: {
                cost(x){
					let a = new Decimal("2").sub(upgradeEffect("i",24))
					return new Decimal("5000").mul(Decimal.add(a).pow(x)).mul(Decimal.add(1.25).pow(Decimal.add(x).pow(2))).mul(Decimal.add(1.1).pow(Decimal.add(1.2).pow(x)))
                },
				title:"增量耐性",
				display() { return "数量:"+format(getBuyableAmount(this.layer, this.id))+"<br>目前:^"+format(buyableEffect(this.layer, this.id))+"<br>价格:"+format(this.cost())},
				canAfford() { return player[this.layer].points.gte(this.cost()) },
				buy() {
					player[this.layer].points = player[this.layer].points.sub(this.cost())
					setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
				},
				unlocked(){return hasUpgrade("i",14)},
				effect(x){
					let eff =  new Decimal(1.05).pow(x)
					eff = softcap(eff,new Decimal(2),0.3)
					return eff
				}
			},
		},
    layerShown(){return hasUpgrade("p",82) || hasMilestone("amo",0)},
		tabFormat: [
			"main-display",
			"blank",
			['display-text',function(){return `你每秒获得`+format(player.i.getpoints)+`增量`}],
			"blank",
			"blank",
			"blank",
			["display-text", function() {return hasUpgrade('i',12) ? '事实上长按即可快速购买重复购买项' : ''}],,
			"buyables",
			"blank",
			"upgrades",
		]
})

addLayer("b", {
    name: "booster",
    symbol: "B",
    position: 10,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#6e64c4",
    requires:function(){return new Decimal(1e200).times(player.g.unlocked?1e100:1)},
    resource: "增幅器",
    baseResource: "通量点",
    baseAmount() {return player.points},
    type: "static",
	branches: ["p"],
    exponent:function(){
		let exp = new Decimal(1.25)
		return exp
	},
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    hotkeys: [
        {key: "b", description: "B: 重置声望树重置的B层", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	update(diff) {
	},
    layerShown(){return hasUpgrade("p",13)},
})

addLayer("g", {
    name: "booster",
    symbol: "G",
    position: 11,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#a3d9a5",
    requires:function(){return new Decimal(1e200).times(player.b.unlocked?1e100:1)},
    resource: "生成器",
    baseResource: "通量点",
    baseAmount() {return player.points},
    type: "static",
	branches: ["p"],
    exponent:function(){
		let exp = new Decimal(1.25)
		return exp
	},
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    hotkeys: [
        {key: "g", description: "G: 重置声望树重置的G层", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	update(diff) {
	},
    layerShown(){return hasUpgrade("p",13)},
})

addLayer("c", {
    name: "coal",
    symbol: "C",
    position: 8,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#666666",
    requires:function(){return new Decimal(1e8).times(player.e.unlocked&&!hasUpgrade("a",44)?1e22:1)},
    resource: "煤",
    baseResource: "灰烬",
    baseAmount() {return player.a.points},
    type: "static",
	branches: ["a"],
    effect(){
        let effect = new Decimal(1)
		if(player.c.unlocked){effect = new Decimal(player[this.layer].points.add(1).pow(0.75))}
        return effect
    },
    effectDescription() {
        return "使灰烬获取增加" + format(tmp[this.layer].effect) + "x"
    },
    canBuyMax() {return hasMilestone(this.layer, 2)},
    exponent:function(){
		let exp = new Decimal(1.1)
		return exp
	},
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    hotkeys: [
        {key: "c", description: "C: 重置燃烧树的C层", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	milestones: {
		0: {
			requirementDescription: "1 煤",
			effectDescription: "每秒自动获得5%的灰烬,灰烬获取底数-2,声望升级'开始'效果*10",
			done() {
				return player.c.points.gte(1)
			},
		},
		1: {
			requirementDescription: "2 煤",
			effectDescription: "一列新的灰烬升级",
			done() {
				return player.c.points.gte(2)
			},
		},
		2: {
			requirementDescription: "3 煤",
			effectDescription: "您可以购买最大煤",
			done() {
				return player.c.points.gte(3)
			},
		},
		3: {
			requirementDescription: "5 煤",
			effectDescription: "与声望无关<br>重置煤炭时保留一切声望",
			done() {
				return player.c.points.gte(5)
			},
		},
		4: {
			requirementDescription: "30 煤",
			effectDescription: "余热<br>只有火焰强度对灰烬获得的影响总和超过200000%(2000倍)时火焰强度才会对灰烬产生影响",
			done() {
				return player.c.points.gte(30)
			},
		},
	},
	upgrades: {
		11: {
			description: "基于你的煤倍增你的灰烬获取.",
			cost: new Decimal(2),
			effect() {return player[this.layer].points.add(2).pow(1.25)},
			effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x"},
			unlocked() {return player[this.layer].unlocked}
		},
        12: {
            description: "火焰强度同样会增强灰烬升级'这是:'.",
            cost: new Decimal(5),
            effect() {
                return new Decimal(player.a.fire.add(1).log(10).add(1))
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x"},
            unlocked() {return hasUpgrade(this.layer, 11)}
        },
        13: {
            description: "你的煤炭会增加你的通量点收益.",
            cost: new Decimal(49),
            effect() {
                return player[this.layer].points.add(2).pow(0.95)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"  
            },
            unlocked() {
                return hasUpgrade(this.layer, 12)
            }
        },
		14: {
            description: "我想你已经解锁增量了吧.希望吧...<br>煤炭提升增量获取",
            cost: new Decimal(64),
            effect() {
				let eff = new Decimal(1)
				if(hasUpgrade("c",14)){eff = player[this.layer].points.pow(1.1).add(1)}
                return eff
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"  
            },
            unlocked() {
                return hasUpgrade(this.layer, 13)
            }
        }
	},
	update(diff) {
	},
    layerShown(){return player.a.points.gte(2e7) || player.c.unlocked},
		tabFormat: [
			"main-display",
			"prestige-button",
			["display-text", function() {return '你有 ' + format(player.a.points) + ' 灰烬.'}],
			"blank",
			"milestones",
			"blank",
			"upgrades",
		]
})

addLayer("e", {
    name: "electricity",
    symbol: "E",
    position: 9,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		energy_max:new Decimal(10),
        energy_1:new Decimal(0),
		energy_2:new Decimal(0),
		energy_3:new Decimal(0),
		allocatedEffects: [
			new Decimal(1),
			new Decimal(1),
			new Decimal(1)
		],
    }},
    color: "#dddd00",
    requires:function(){return new Decimal(1e8).times(player.c.unlocked&&!hasUpgrade("a",44)?1e22:1)},
    resource: "电力",
    baseResource: "灰烬",
    baseAmount() {return player.a.points},
    type: "normal",
	branches: ["a"],
    exponent:function(){
		let exp = new Decimal(0.75)
		return exp
	},
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    effect() {
        let effect = player[this.layer].points.sqrt()
        if (effect.gte(50)) {
            effect = player[this.layer].points.log(10).add(1).mul(new Decimal(50).div(new Decimal(2500).log(10).add(1)))
        }
        return effect
    },
    effectDescription() {
        return "提升电池强度 " + format(tmp[this.layer].effect) + "x"
    },
    hotkeys: [
        {key: "e", description: "E: 重置燃烧树的E层", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	update(diff) {
        player[this.layer].allocatedEffects[0] = tmp[this.layer].effect.mul(player[this.layer].energy_1 / 10).mul(upgradeEffect("a",42)).mul(upgradeEffect("e",21)).add(1).pow(0.75)
        player[this.layer].allocatedEffects[1] = tmp[this.layer].effect.mul(player[this.layer].energy_2 / 10).mul(upgradeEffect("a",42)).mul(upgradeEffect("e",21)).mul(upgradeEffect("a",43)).add(1)
		player[this.layer].allocatedEffects[2] = tmp[this.layer].effect.mul(player[this.layer].energy_3 / 10).mul(upgradeEffect("a",42)).mul(upgradeEffect("e",21)).add(1).pow(1.25)
	},
	upgrades: {
		11: {
			title: "电容库扩充I",
			description: "电力分配上限+10%",
			cost:function(){return new Decimal("5e4")},
			onPurchase(){
				player.e.energy_max = player.e.energy_max.add(1)
			},
			unlocked(){return hasMilestone("e",3)}
		},
		12: {
			title: "电容库扩充II",
			description: "电力分配上限+10%",
			cost:function(){return new Decimal("5e8")},
			onPurchase(){
				player.e.energy_max = player.e.energy_max.add(1)
			},
			unlocked(){return hasUpgrade("e",11)}
		},
		13: {
			title: "电容库扩充III",
			description: "电力分配上限+10%",
			cost:function(){return new Decimal("5e16")},
			onPurchase(){
				player.e.energy_max = player.e.energy_max.add(1)
			},
			unlocked(){return hasUpgrade("e",12)}
		},
		14: {
			title: "电容库扩充IV",
			description: "电力分配上限+10%",
			cost:function(){return new Decimal("5e32")},
			onPurchase(){
				player.e.energy_max = player.e.energy_max.add(1)
			},
			unlocked(){return hasUpgrade("e",13)}
		},
		15: {
			title: "电容库扩充V",
			description: "电力分配上限+10%",
			cost:function(){return new Decimal("5e64")},
			onPurchase(){
				player.e.energy_max = player.e.energy_max.add(1)
			},
			unlocked(){return hasUpgrade("e",14)}
		},
		21: {
			title: "发电站扩充I",
			description: "电力效果+15%",
			cost:function(){return new Decimal("5e4")},
			effect(){
				let eff = new Decimal(1)
				if(hasUpgrade("e",21)){eff = new Decimal(1.15)}
				if(hasUpgrade("e",22)){eff = new Decimal(1.3)}
				if(hasUpgrade("e",23)){eff = new Decimal(1.45)}
				if(hasUpgrade("e",24)){eff = new Decimal(1.6)}
				if(hasUpgrade("e",25)){eff = new Decimal(1.75)}
				return eff
			},
			unlocked(){return hasMilestone("e",3)}
		},
		22: {
			title: "发电站扩充II",
			description: "电力效果+15%",
			cost:function(){return new Decimal("5e8")},
			unlocked(){return hasUpgrade("e",21)}
		},
		23: {
			title: "发电站扩充III",
			description: "电力效果+15%",
			cost:function(){return new Decimal("5e16")},
			unlocked(){return hasUpgrade("e",22)}
		},
		24: {
			title: "发电站扩充IV",
			description: "电力效果+15%",
			cost:function(){return new Decimal("5e32")},
			unlocked(){return hasUpgrade("e",23)}
		},
		25: {
			title: "发电站扩充V",
			description: "电力效果+15%",
			cost:function(){return new Decimal("5e64")},
			unlocked(){return hasUpgrade("e",24)}
		},
		31: {
			title: "耗能源扩充I",
			description: "解锁新电池进度+20%",
			cost:function(){return new Decimal("5e4")},
			effect(){
				let eff = new Decimal(0)
				if(hasUpgrade("e",31)){eff = new Decimal(20)}
				if(hasUpgrade("e",32)){eff = new Decimal(40)}
				if(hasUpgrade("e",33)){eff = new Decimal(60)}
				if(hasUpgrade("e",34)){eff = new Decimal(80)}
				if(hasUpgrade("e",35)){eff = new Decimal(100)}
				return eff
			},
			unlocked(){return hasMilestone("e",3)}
		},
		32: {
			title: "耗能源扩充II",
			description: "解锁新电池进度+20%",
			cost:function(){return new Decimal("5e8")},
			unlocked(){return hasUpgrade("e",31)}
		},
		33: {
			title: "耗能源扩充III",
			description: "解锁新电池进度+20%",
			cost:function(){return new Decimal("5e16")},
			unlocked(){return hasUpgrade("e",32)}
		},
		34: {
			title: "耗能源扩充IV",
			description: "解锁新电池进度+20%",
			cost:function(){return new Decimal("5e32")},
			unlocked(){return hasUpgrade("e",33)}
		},
		35: {
			title: "耗能源扩充V",
			description: "解锁新电池进度+20%",
			cost:function(){return new Decimal("5e64")},
			unlocked(){return hasUpgrade("e",34)}
		},
	},
	milestones: {
		0: {
			requirementDescription: "1 电力",
			effectDescription: "每秒自动获得5%的灰烬,声望升级'开始'效果*2",
			done() {
				return player.e.points.gte(1)
			},
		},
		1: {
			requirementDescription: "25 电力",
			effectDescription: "一排新的灰烬升级",
			done() {
				return player.e.points.gte(25)
			},
		},
		2: {
			requirementDescription: "12500 电力",
			effectDescription: "与声望无关<br>重置电力时保留一切声望",
			done() {
				return player.e.points.gte(12500)
			},
		},
		3: {
			requirementDescription: "50000 电力",
			effectDescription: "解锁一些电力升级",
			done() {
				return player.e.points.gte(25000)
			},
		},
	},
	clickables:{
		11:{
			title:"-",
			canClick(){return player.e.energy_1.gte(1)},
			unlocked(){return true},
			onClick(){
				player.e.energy_1 = player.e.energy_1.sub(1)
				player.e.energy_max = player.e.energy_max.add(1)
			},
			style: {"height": "50px", "width": "50px","min-height":"50px"},
		},
		12:{
			title:"+",
			canClick(){return player.e.energy_1.lt(10) && player.e.energy_max.gt(0)},
			unlocked(){return true},
			onClick(){
				player.e.energy_1 = player.e.energy_1.add(1)
				player.e.energy_max = player.e.energy_max.sub(1)
			},
			style: {"height": "50px", "width": "50px","min-height":"50px"},
		},
		21:{
			title:"-",
			canClick(){return player.e.energy_2.gte(1)},
			unlocked(){return true},
			onClick(){
				player.e.energy_2 = player.e.energy_2.sub(1)
				player.e.energy_max = player.e.energy_max.add(1)
			},
			style: {"height": "50px", "width": "50px","min-height":"50px"},
		},
		22:{
			title:"+",
			canClick(){return player.e.energy_2.lt(10) && player.e.energy_max.gt(0)},
			unlocked(){return true},
			onClick(){
				player.e.energy_2 = player.e.energy_2.add(1)
				player.e.energy_max = player.e.energy_max.sub(1)
			},
			style: {"height": "50px", "width": "50px","min-height":"50px"},
		},
		31:{
			title:"-",
			canClick(){return player.e.energy_3.gte(1)},
			unlocked(){return true},
			onClick(){
				player.e.energy_3 = player.e.energy_3.sub(1)
				player.e.energy_max = player.e.energy_max.add(1)
			},
			style: {"height": "50px", "width": "50px","min-height":"50px"},
		},
		32:{
			title:"+",
			canClick(){return player.e.energy_3.lt(10) && player.e.energy_max.gt(0)},
			unlocked(){return true},
			onClick(){
				player.e.energy_3 = player.e.energy_3.add(1)
				player.e.energy_max = player.e.energy_max.sub(1)
			},
			style: {"height": "50px", "width": "50px","min-height":"50px"},
		},
	},
	bars: {
		bigBar0: {
            direction: RIGHT,
            width: 300,
            height: 50,
            progress() {
                return player.e.energy_1 / 10
            },
            display() {
                return "降低火焰丢失速度 (/"+format(player[this.layer].allocatedEffects[0])+")"
            },
            baseStyle: {
                "background-color": "#FFFFFF"
            },
            fillStyle: {
                "background-color": "#DDDD00"
            },
            textStyle: {
                "color": "#000000"
            }
		},
		bigBar1: {
            direction: RIGHT,
            width: 300,
            height: 50,
            progress() {
                return player.e.energy_2 / 10
            },
            display() {
                return "提高灰烬获取 ("+format(player[this.layer].allocatedEffects[1])+"*)"
            },
            baseStyle: {
                "background-color": "#FFFFFF"
            },
            fillStyle: {
                "background-color": "#DDDD00"
            },
            textStyle: {
                "color": "#000000"
            }
		},
		bigBar2: {
            direction: RIGHT,
            width: 300,
            height: 50,
            progress() {
                return player.e.energy_3 / 10
            },
            display() {
                return "提高通量点获取 ("+format(player[this.layer].allocatedEffects[2])+"*)"
            },
            baseStyle: {
                "background-color": "#FFFFFF"
            },
            fillStyle: {
                "background-color": "#DDDD00"
            },
            textStyle: {
                "color": "#000000"
            }
        },
	},
    layerShown(){return player.a.points.gte(2e7) || player.e.unlocked},
		tabFormat: [
			"main-display",
			"prestige-button",
			["display-text", function() {return '你有 ' + format(player.a.points) + ' 灰烬.'}],
			"blank",
			"milestones",
			"blank",
			"upgrades",
			"blank",
			["display-text", function() {return '电力分配 ' + format(player.e.energy_1.add(player.e.energy_2).add(player.e.energy_3).mul(10),0) + '% / '+format(player.e.energy_1.add(player.e.energy_2).add(player.e.energy_3).add(player.e.energy_max).mul(10),0)+"%"}],
			"blank",
			["display-text", function() {return hasMilestone("e",3) ? '距离下一个电池还有 '+format(Decimal.add(100).sub(upgradeEffect("e",31)))+'% 的进度去解锁.':""}],
			"blank",
			["row", [["clickable", 11],"blank",["bar", "bigBar0"], "blank", ["clickable", 12]]],
			"blank",
			["row", [["clickable", 21],"blank",["bar", "bigBar1"], "blank", ["clickable", 22]]],
			"blank",
			["row", [["clickable", 31],"blank",["bar", "bigBar2"], "blank", ["clickable", 32]]],
		]
})

addLayer("am", {
    name: "Antimatter",
    symbol: "AM",
    position: 12,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		eff11:new Decimal(0),
    }},
    color: "#DB4C83",
    requires:function(){return new Decimal(100)},
    resource: "反物质",
    baseResource: "增量重复购买项",
    baseAmount() {return player.i.allbuy},
    type: "normal",
	branches: ["i"],
	effect(){
		let a = player.am.points
		if (a.eq(0) && player.am.best.gt(0)) a = new Decimal(1)
		let ret = a.plus(1).pow(Math.log(3)/Math.log(2))
        if (ret.gt(100)) ret = ret.div(100).sqrt().times(100)
		if (ret.gt(1000)) ret = ret.div(1000).pow(.25).times(1000)
        if (ret.gt(1e4)) ret = ret.div(1e4).pow(.125).times(1e4)
		if (ret.gt(1e5)) ret = ret.log10().times(2).pow(5)
		if (ret.gt(1e10)) ret = ret.log10().pow(10)
		if (ret.gt(1e25)) ret = ret.log10().times(4000).pow(5)
		return ret
    },
	effectDescription(){
		return "增量获得量和通量点获得量乘 " + format(tmp.am.effect)
    },
    exponent:function(){
		let exp = new Decimal(10)
		return exp
	},
    gainMult() {
        mult = new Decimal(1)
		if (player.amo.unlocked){mult = mult.times(tmp.amo.effect[1])}
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 2,
    hotkeys: [
        {key: "shift+a", description: "AM: 重置增量宇宙树的AM层", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	update(diff) {
		player.am.eff11 = new Decimal(1).add(player.am.points.mul(0.00000001))
		generatePoints("am", this.revenue(diff))
	},
    layerShown(){return player.i.allbuy.gte(100) || player.am.unlocked},
		doReset(resettingLayer) {
			if (layers[resettingLayer].row > layers[this.layer].row) {
				let keep = []
				if (resettingLayer=="amo" && hasMilestone("amo",1)) keep.push("upgrades");
				if (resettingLayer=="amo" && hasMilestone("amo",2)) keep.push("upgrades");
				layerDataReset(this.layer, keep)
			}
			player.a.fire = new Decimal(100)
		},
        upgrades:{
			11:{
				title: "增量增量", 
				description: "增量数量提升增量获得量",
				cost: new Decimal(2),
				effect(){
					let exp = 1
					return player.i.points.plus(10).log10().pow(exp)
				},
				effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"×"}, 
			},
			12:{
				title: "保留", 
				description: "增量获取*3,重置增量树AM时保留除了I以外的一切",
				cost: new Decimal(2),
				effect(){
					let eff = new Decimal(1)
					if(hasUpgrade("am",12)){eff = new Decimal(3)}
					return eff
				},
				effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"×"}, 
				unlocked(){return hasUpgrade("am",11)}
			},
			13:{
				title: "保留II", 
				description: "增量获取*3,重置燃烧树C,E,声望树B,G时保留I",
				cost: new Decimal(10),
				effect(){
					let eff = new Decimal(1)
					if(hasUpgrade("am",13)){eff = new Decimal(3)}
					return eff
				},
				effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"×"}, 
				unlocked(){return hasUpgrade("am",12)}
			},
			14:{
				title: "全自动", 
				description: "自动获得反物质",
				cost: new Decimal(100),
				unlocked(){return hasUpgrade("am",13)}
			},
			15:{
				title: "回忆", 
				description: "再解锁一排声望升级",
				cost: new Decimal(1000),
				unlocked(){return hasUpgrade("am",14)}
			},
			21:{
				title: "全自动II", 
				description: "每秒获得1000%的反物质",
				cost: new Decimal(1000),
				unlocked(){return hasUpgrade("am",15)}
			},
			22:{
				title: "全自动III", 
				description: "每秒获得10000%的反物质",
				cost: new Decimal(10000),
				unlocked(){return hasUpgrade("am",15)}
			},
			23:{
				title: "全自动IV", 
				description: "每秒获得100000%的反物质",
				cost: new Decimal(100000),
				unlocked(){return hasUpgrade("am",15)}
			},
			24:{
				title: "全自动V", 
				description: "每秒获得1000000%的反物质",
				cost: new Decimal(1000000),
				unlocked(){return hasUpgrade("am",15)}
			},
			25:{
				title: "全自动VI", 
				description: "每秒获得10000000%的反物质",
				cost: new Decimal(10000000),
				unlocked(){return hasUpgrade("am",15)}
			},
		},
		challenges: {
			11: {
				name: "Konw?",
				challengeDescription: "增量获得量变为原来的0.1次方",
				unlocked(){return true},
				canComplete:function(){return player.points.gte(1e140)},
				goalDescription:"1e140 通量点",
				rewardDescription(){return "反物质也会增加声望获取<br>*"+format(player.am.eff11)+"声望获取"},
				onEnter(){
				},
				onExit(){
				},
			},
			12: {
				name: "No!",
				challengeDescription: "声望获得量变为原来的0.1次方<br>进入重置声望点数",
				unlocked(){return true},
				canComplete:function(){return player.p.points.gte(1e72)},
				goalDescription:"1e72 声望",
				rewardDescription(){return "通量点获取增加7位数量级"},
				onEnter(){
					player.p.points = new Decimal(0)
				},
				onExit(){
				},
			},
		},
		revenue(diff) {
			let amu = 0
			if (hasUpgrade("am",14)){amu = 100}
			if (hasUpgrade("am",21)){amu = 1000}
			if (hasUpgrade("am",22)){amu = 10000}
			if (hasUpgrade("am",23)){amu = 100000}
			if (hasUpgrade("am",24)){amu = 1000000}
			if (hasUpgrade("am",25)){amu = 10000000}
			return diff * amu / 100
		},  
})

addLayer("amo", {
    name: "Amoebas",
    symbol: "A",
    position: 10,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#1B4C23",
    requires:function(){return new Decimal("1e67")},
    resource: "变形虫",
    baseResource: "增量",
    baseAmount() {return player.i.points},
    type: "normal",
	branches: ["am"],
        effect(){
			let a = player.amo.points
			let eff1 = Decimal.add(1, a).pow(10)
			let eff2 = Decimal.add(2, a).div(2).pow(5)
			if (a.gt(200) && a.lt(20000)) eff1 = Decimal.add(1, a).sub(200).pow(5).add(Decimal.add(1, 200).pow(10))
			if (a.gt(400) && a.lt(40000)) eff2 = Decimal.add(2, a).sub(400).div(4).pow(2.5).add(Decimal.add(2, 400).div(2).pow(5))
			if (a.gt(20000) && a.lt(2e10)) eff1 = Decimal.add(1, a).sub(20000).pow(2.5).add(Decimal.add(1, 200).pow(10)).add(Decimal.add(1, 20000).sub(200).pow(5))
			if (a.gt(40000) && a.lt(4e10)) eff2 = Decimal.add(2, a).sub(40000).div(8).pow(1.25).add(Decimal.add(2, 400).div(2).pow(5)).add(Decimal.add(2, 40000).sub(400).div(4))
			if (a.gt(2e10)) eff1 = Decimal.add(1, a).sub(2e10).pow(1.25).add(Decimal.add(1, 200).pow(10)).add(Decimal.add(1, 200).pow(10)).add(Decimal.add(1, 20000).sub(200).pow(5)).add(Decimal.add(1, 2e10).sub(20000).pow(2.5))
			if (a.gt(4e10)) eff2 = Decimal.add(2, a).sub(4e10).div(16).pow(1.125).add(Decimal.add(2, 400).div(2).pow(5)).add(Decimal.add(2, 400).div(2).pow(5)).add(Decimal.add(2, 40000).sub(400).div(4)).add(Decimal.add(2, 4e10).sub(40000))
			return [eff1, eff2]
        },
        effectDescription(){
			return "增量获得量和点数获得量乘 " + format(tmp[this.layer].effect[0]) + " ，反物质获得量乘 " + format(tmp[this.layer].effect[1])
        },
    exponent:function(){
		let exp = new Decimal(0.05)
		return exp
	},
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 3,
    hotkeys: [
        {key: "shift+a", description: "A: 重置增量宇宙树的A层", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	update(diff) {
		generatePoints("amo", this.revenue(diff))
	},
	milestones: {
		0: {
			requirementDescription: "1 变形虫",
			effectDescription: "保留声望全部,保持增量可见",
			done() {
				return player.amo.points.gte(1)
			},
		},
		1: {
			requirementDescription: "2 变形虫",
			effectDescription: "真正的保留<br>重置保留反物质升级",
			done() {
				return player.amo.points.gte(2)
			},
		},
		2: {
			requirementDescription: "5 变形虫",
			effectDescription: "重置保留反物质点数",
			done() {
				return player.amo.points.gte(5)
			},
		},
		3: {
			requirementDescription: "20 变形虫",
			effectDescription: "自动获得变形虫",
			done() {
				return player.amo.points.gte(20)
			},
		},
		4: {
			requirementDescription: "1e6 变形虫",
			effectDescription: "解锁反物质挑战",
			done() {
				return player.amo.points.gte(20)
			},
		},
	},
	revenue(diff) {
			let amu = 0
			if (hasMilestone("amo",3)){amu = 100}
			return diff * amu / 100
		}, 
    layerShown(){return hasUpgrade("am",25) || player.amo.unlocked},
})

addLayer("co", {
    name: "coins",
    symbol: "C",
    position: 12,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		eff11:new Decimal(0),
    }},
    color: "#FFFF00",
    requires:function(){return new Decimal(1e150)},
    resource: "金币",
    baseResource: "通量点",
    baseAmount() {return player.points},
    type: "normal",
    exponent:function(){
		let exp = new Decimal(0.5)
		return exp
	},
    gainMult() {
        mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 5,
    hotkeys: [
        {key: "shift+c", description: "C: 重置王朝之系谱的C层", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
	update(diff) {
		generatePoints("co", this.revenue(diff))
	},
    layerShown(){return hasUpgrade("p",83) || player.co.unlocked},
		revenue(diff) {
			let cu = 0
			return diff * cu / 100
		},	
		doReset(resettingLayer) {
			if (layers[resettingLayer].row > layers[this.layer].row) {
				let keep = []
				layerDataReset(this.layer, keep)
			}
			player.p.unlocked = false
			player.c.unlocked = false
			player.e.unlocked = false
			player.am.unlocked = false
			player.amo.unlocked = false
		},
		upgrades: {
			11: {
				description: "通量点获取增强10000倍<br>完成重构'声望重构'",
				cost:function(){return new Decimal("1")},
				effect(){
					let eff = new Decimal(10000)
					return eff
				},
			},
			12: {
				description: "根据金币总数,增强第一个'增强'",
				cost:function(){return new Decimal("100")},
				effect(){
					let ret = player[this.layer].total.div(5).add(1).max(1).log10().add(1)
					return ret
				},
				effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"×"}, 
			},
		},
	tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", function() {return '你有 ' + format(player.points) + ' 通量点.'}],
		"blank",
		["display-text", function() {return '把树堆积在一起多不是一件没事啊,所以我把这个层放在下面没毛病吧,当然,重置依然会将上面的全部带走噢.<br><h6>事实上,除了声望重构第一个升级还会使以前层永久可见,煤炭,电力层价格回归初始状态.'}],
		"blank",
        "upgrades"
    ]
})

addLayer("reff", {
    name: "refactorseffect",
    symbol: "R<h6>effect",
    position: 12,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		eff11:new Decimal(0),
    }},
	tooltip() { 
		return `重构效果`
	},
    color: "rgb(76,171,245)",
    type: "none",
    row: 'side',
    layerShown(){return hasUpgrade("co",11) || player.reff.unlocked},
    infoboxes: {
        lore: {
            title: "重构效果",
            body: "这里记录了关于游戏制作树重构阶层的效果,但是正常来说,你第一个获得的效果是在王朝的金币(同时也是游戏制作树的金钱)中获得的,换句话说,你可能先获得重构加成再解锁重构,无论怎么样,这里记录你关于重构效果的全部",
        },
		P: {
            title: "声望重构——lv.1",
            body: "永久显示先前16个升级并自动购买它们且无消耗<br>所有升级效果*1.25<br>'声望增益','协同协同'软上限启用延迟10倍<br>每秒自动获得1000%的重置时可获得声望<br>声望获得*1.5<br>'威望增量'效果变为点数获取*10,移除第二个效果<br>'我们不需要更多点数'第一个效果变为^1.025,移除第二个效果",
        },
    },
	tabFormat: [
		["infobox", "lore"],
		"blank",
        ["infobox", "P"],
    ]
})