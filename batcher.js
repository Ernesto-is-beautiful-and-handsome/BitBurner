import { best, findRam, shotgun } from "./functions.js"
/** @param {NS} ns */
export async function main(ns) {
	let spacer = 100 //ms
	let hacks = 0.80
	let target = ns.getServer(best(ns))
	let limits = [3, Infinity]
	let scripts = ["weaken.js", "grow.js", "weaken.js"]
	let hack = [
		() => hacks / ns.hackAnalyze(target.hostname)
	]
	let weaken = [
		() => (target.hackDifficulty - target.minDifficulty) * 20,
		() => ns.hackAnalyzeSecurity(basics["hack.js"][0][0]() * 20),
		() => ns.growthAnalyzeSecurity(basics["grow.js"][0][1]() * 20),
		() => ns.growthAnalyzeSecurity(basics["grow.js"][0][2]() * 20)
	]
	let grow = [
		() => ns.tprint("How did you get here"),
		() => solveGrow(target.moneyAvailable, target.moneyMax),
		() => solveGrow(target.moneyMax * (1 - hacks), target.moneyMax)
	]
	let basics = {
		"hack.js": [hack, 0.75],
		"weaken.js": [weaken, 0],
		"grow.js": [grow, 0.2],
	}
	let object
	while (true) {
		shotgun(ns)
		let order
		target = ns.getServer(best(ns))
		for (let limit of limits) {
			let time = ns.formulas.hacking.weakenTime(target, ns.getPlayer())
			for (order = 0; order < limit; order++) {
				object = scripts[order % 4]
				if (Math.ceil(basics[object][0][order % 4]() > 0)) {
					if (ns.exec(object,
						findRam(ns),
						Math.ceil(basics[object][0][order % 4]()),
						time * basics[object][1] + spacer * order,
						target.hostname,
						order,
						time + spacer * order
					) == 0) {
						break
					}
				}
			}
			ns.tprint("Batch ended with: ", object, " threads: ", Math.ceil(basics[object][0][order % 4]()), " and ", Math.floor(order / 4), " batches")
			ns.tprint(`Sleeping for ${(time + spacer * order + 1000)/1000} seconds`)
			scripts.unshift("hack.js")
			await ns.sleep(time + spacer * order + 1000)
		}
		scripts.shift()
		scripts.shift()
	}
	function solveGrow(money_lo, money_hi) {
		if (money_lo >= money_hi) { return 0; }
		let base = ns.formulas.hacking.growPercent((target), 1, ns.getPlayer(), 1)
		let threads = 1000;
		let prev = threads;
		for (let i = 0; i < 30; ++i) {
			let factor = money_hi / Math.min(money_lo + threads, money_hi - 1);
			threads = Math.log(factor) / Math.log(base);
			if (Math.ceil(threads) == Math.ceil(prev)) { break; }
			prev = threads;
		}

		return Math.ceil(Math.max(threads, prev, 0));
	}
}