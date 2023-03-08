/** @param {NS} ns */
export async function main(ns) {
	let time = Date.now()
	const red = "\u001b[38;5;203m";
	await ns.sleep(ns.args[0])
	await ns.weaken(ns.args[1]) 
	time = Math.trunc(Date.now() - time - ns.args[3])
	if (time > 100) ns.tprint(`${red + "weaken	"}`, ns.args[2], "	", `${red + time}`);
}