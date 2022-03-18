let modInfo = {
	name: "以树为树 - The Trees For Tree - TTFT",
	id: "treesfortree",
	author: "辉影神秘",
	pointsName: "通量点",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "4.10.14.e350",
	name: "以树为树",
}

let changelog = `
	<h2>版本号准则:<br></h3>
		<h4>v<t id="red">a</t>.<t id="yellow">b</t>.<t id="blue">c</t>.<t id="green">d</t><br>
		<t id="red">a</t>:含有树种类数量<br>
		<t id="yellow">b</t>:含有有实际内容的节点数量<br>
		<t id="blue">c</t>:总节点数量<br>
		<t id="green">d</t>:残局点数<br>
		<br>
		<br>
		<br>
	<h2>更新日志:<br><h3>
		<h5><t id="red">剧透警告</t></h5><br>
		<h4>第三个版本:<br>
		<h4>v<t id="red">4</t>.<t id="yellow">10</t>.<t id="blue">14</t>.<t id="green">e350</t></h4><br>
		<br>
		<h4>标准更新:</h4>
		<h5>
		<li>新添 金币层 增强器层 生成器层 及其内容<br>
		<li>新添除了上方的 时间胶囊层 增强层 空间能量层 没有实际内容<br>
		<li>残局到达 1e333 通量点<br>
		</h5>
		<br>
		<br>
		<br>
		<br>
		<h4>其他更新:</h4>
		<h5>
		<li>修改并添加了煤炭里程碑,灰烬层升级31速度变快<br>
		<li>完成了新的电池和新的一排电池升级<br>
		<li>完成了金币升级,完善了一些东西<br>
		</h5>
		<h4>第二个版本:<br>
		<h4>v<t id="red">4</t>.<t id="yellow">7</t>.<t id="blue">10</t>.<t id="green">e150</t></h4><br>
		<br>
		<h4>标准更新:</h4>
		<h5>
		<li>新添 王朝之系谱<br>
		<li>新添 电力层 反物质层 变形虫层 及其内容<br>
		<li>新添除了上方的 金币层 没有实际内容<br>
		<li>残局到达 1e150 通量点<br>
		</h5>
		<br>
		<h4>其他更新:</h4>
		<h5>
		<li>修复了灰烬层升级31,32是每tick判定而不是每秒的bug<br>
		<li>煤层30煤里程碑效果2000倍<br>
		<li>前5个增量升级消耗增加1位数量级<br>
		<li>P协同协同升级效果增量<br>
		</h5>
		<br>
		<br>
		<br>
		<h4>第一个版本:<br>
		<h4>v<t id="red">3</t>.<t id="yellow">4</t>.<t id="blue">7</t>.<t id="green">e37</t></h4><br>
		<br>
		<h4>标准更新:</h4>
		<h5>
		<li>新添 声望树重置 燃烧树 增量树宇宙<br>
		<li>新添 声望层 灰烬层 煤层 增量层 及其内容<br>
		<li>新添除了上方的 电力层 增幅器层 生成器层 但是没有实际内容<br>
		<li>残局到达 1e37 通量点<br>
		</h5>
		<br>
		<h4>其他更新:</h4>
		<h5>
		<li>无<br>
		</h5>
`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	if (hasUpgrade("p",11)){gain = gain.add(upgradeEffect("p",11))}
	if (hasUpgrade("i",11) && !hasUpgrade("i",21)){gain = gain.add(upgradeEffect("i",11))}
	if (hasUpgrade("p",12)){gain = gain.mul(upgradeEffect("p",12))}
	if (hasUpgrade("p",13)){gain = gain.mul(upgradeEffect("p",13))}
	if (hasUpgrade("p",24)){gain = gain.mul(upgradeEffect("p",24))}
	if (hasUpgrade("p",33)){gain = gain.mul(upgradeEffect("p",33))}
	if (hasUpgrade("a",21)){gain = gain.mul(upgradeEffect("a",21))}
	if (hasUpgrade("a",41)){gain = gain.mul(upgradeEffect("a",41))}
	if (hasUpgrade("c",14)){gain = gain.mul(upgradeEffect("c",14))}
	if (hasUpgrade("i",21)){gain = gain.mul(upgradeEffect("i",11))}
	if (hasUpgrade("co",11)){gain = gain.mul(upgradeEffect("co",11))}
	if (hasUpgrade("co",12)){gain = gain.mul(upgradeEffect("co",12))}
	if (hasUpgrade("co",13)){gain = gain.mul(upgradeEffect("co",13))}
	if (hasUpgrade("co",14)){gain = gain.mul(upgradeEffect("co",14))}
	if (hasUpgrade("co",15)){gain = gain.mul(upgradeEffect("co",15))}
	if (player["e"].unlocked){gain = gain.mul(player["e"].allocatedEffects[2])}
	if (player.am.unlocked){gain = gain.mul(tmp.am.effect)}
	if (player.amo.unlocked){gain = gain.mul(tmp.amo.effect[0])}
	if (hasChallenge("am",12)){gain = gain.mul(10000000)}
	if (player.g.unlocked){gain = gain.mul(tmp.g.powerEff)}
	if (player.b.unlocked){gain = gain.mul(tmp.b.effect)}
	if (hasUpgrade("p",23)){gain = gain.div(upgradeEffect("p",23))}
	if (hasUpgrade("p",32)){gain = gain.pow(upgradeEffect("p",32))}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("1e350"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}