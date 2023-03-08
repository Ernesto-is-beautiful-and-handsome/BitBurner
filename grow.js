/** @param {NS} ns */
export async function main(ns) {
	let time = Date.now()
	const yellow = "\u001b[38;5;185m";
	await ns.sleep(ns.args[0])
	await ns.grow(ns.args[1])
	time = Math.trunc(Date.now() - time - ns.args[3])
	if (time > 100) ns.tprint(`${yellow + "grow		"}`, ns.args[2], "	", `${yellow + time}`);

}