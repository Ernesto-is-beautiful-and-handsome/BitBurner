/** @param {NS} ns */
export function getAllServers(ns) {
	var servers = ["home"];
	var levels = [0];
	for (let i = 0; i < servers.length; i++) {
		if (levels[i] < 16) {
			var connected = ns.scan(servers[i]);
			for (let c = 0; c < connected.length; c++) {
				if (servers.includes(connected[c]) == false) {
					servers.push(connected[c]);
					levels.push(levels[i] + 1);
				}
			}
		}
	}
	return servers;
}

export function shotgun(ns) {
	let functions = [
		(server) => ns.brutessh(server),
		(server) => ns.relaysmtp(server),
		(server) => ns.ftpcrack(server),
		(server) => ns.httpworm(server),
		(server) => ns.sqlinject(server),
		(server) => ns.nuke(server),
		(server) => ns.scp("hack.js", server, "home"),
		(server) => ns.scp("weaken.js", server, "home"),
		(server) => ns.scp("grow.js", server, "home"),
		(server) => contracts(ns, server)
	]
	for (let server of getAllServers(ns)) {
		for (let task of functions) {
			try { task(server) } catch { }
		}
	}
}

export function best(ns) {
	let servers = getAllServers(ns).filter(s => Weight(ns, s) > 0);
	return servers.sort((a, b) => Weight(ns, b) - Weight(ns, a))[0];
}

// Returns a weight that can be used to sort servers by hack desirability
function Weight(ns, server) {
	if (!server) return 0;
	if (server.startsWith('hacknet-node')) return 0;
	let so = ns.getServer(server);
	if (!so.hasAdminRights) return 0
	so.hackDifficulty = so.minDifficulty;
	let player = ns.getPlayer();
	if (so.requiredHackingSkill > player.skills.hacking / 2) return 0;
	let weight = so.moneyMax / so.minDifficulty;
	if (ns.fileExists('Formulas.exe')) {
		weight = so.moneyMax / ns.formulas.hacking.weakenTime(so, player) * ns.formulas.hacking.hackChance(so, player);
	}
	return weight;
}

function contracts(ns, server) {
	let contracts = ns.ls(server, ".cct")
	if (contracts.length > 0) {
		for (let contract of contracts) {
			ns.run("solver.js", 1, contract, server)
		}
	}
}

export async function backdoor(ns) {
	for (let server of getAllServers(ns)) {
		if (ns.getServer(server).backdoorInstalled || ns.getServer(server).requiredHackingSkill > ns.getHackingLevel() || !ns.hasRootAccess(server)) continue
		else {
			let path = [server]
			while (ns.scan(server)[0] != "home") {
				server = ns.scan(server)[0]
				path.unshift(server)
			}
			for (let step of path) {
				ns.singularity.connect(step)
			}
			await ns.singularity.installBackdoor()
			ns.tprint(`backdoored ${server}`)
			ns.singularity.connect("home")
		}
	}
}

export function findRam(ns) {
	let list = getAllServers(ns).filter(server => ns.hasRootAccess(server))
		return list.sort((a, b) => (ns.getServerMaxRam(b) - ns.getServerUsedRam(b)) - (ns.getServerMaxRam(a) - ns.getServerUsedRam(a)))[0]
	}