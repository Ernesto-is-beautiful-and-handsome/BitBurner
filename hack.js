/** @param {NS} ns */
export async function main(ns) {
	let time = Date.now()
	const white = "\u001b[38;5;250m";
	await ns.sleep(ns.args[0])
	await ns.hack(ns.args[1])
	time = Math.trunc(Date.now() - time - ns.args[3])
	if (Math.abs(time) > 100) ns.tprint(`${white + "hack		"}`, ns.args[2], "	", `${white + time}`);
}