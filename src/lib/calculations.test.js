import { describe, expect, it } from "vitest";
import { getRemainingForWeapon, getRemainingForWeapons } from "./calculations";
import { weapons } from "./upgradeCollections";

const byName = Object.fromEntries(weapons.map((weapon) => [weapon.name, weapon]));

describe("getRemainingForWeapon", () => {
	it("totals Shockwave Gun cost from level 0", () => {
		expect(getRemainingForWeapon(byName["Shockwave Gun"], 0)).toEqual({ lim: 13250, lunum: 6 });
	});

	it("totals Shockwave Gun remaining from level 4", () => {
		expect(getRemainingForWeapon(byName["Shockwave Gun"], 4)).toEqual({ lim: 10600, lunum: 5 });
	});

	it("counts the 0-cost board-unlock level for Drone Hive", () => {
		expect(getRemainingForWeapon(byName["Drone Hive"], 0)).toEqual({ lim: 2400, lunum: 1 });
	});

	it("totals Jackhammer cost from level 0", () => {
		expect(getRemainingForWeapon(byName["Jackhammer"], 0)).toEqual({ lim: 28900, lunum: 6 });
	});

	it("returns zero remaining for a maxed weapon", () => {
		expect(getRemainingForWeapon(byName["Lim Cannon"], 8)).toEqual({ lim: 0, lunum: 0 });
	});

	it("only counts Shockwave Gun level 1 at Shelter level 0", () => {
		expect(getRemainingForWeapon(byName["Shockwave Gun"], 0, 0)).toEqual({ lim: 100, lunum: 0 });
	});

	it("hides Charge Piercer cost until its unlock Shelter level", () => {
		expect(getRemainingForWeapon(byName["Charge Piercer"], 0, 0)).toEqual({ lim: 0, lunum: 0 });
	});

	it("unlocks the post-game cap at Shelter level 5", () => {
		expect(getRemainingForWeapon(byName["Jackhammer"], 0, 5)).toEqual({ lim: 28900, lunum: 6 });
	});
});

describe("getRemainingForWeapons", () => {
	it("totals Attack main-game weapons (excludes post-game)", () => {
		const attackMain = weapons.filter(
			(weapon) => weapon.type === "Attack" && weapon.phase === "main",
		);
		expect(getRemainingForWeapons(attackMain, {})).toEqual({ lim: 52750, lunum: 24 });
	});

	it("totals Defensive main-game weapons", () => {
		const defensiveMain = weapons.filter(
			(weapon) => weapon.type === "Defensive" && weapon.phase === "main",
		);
		expect(getRemainingForWeapons(defensiveMain, {})).toEqual({ lim: 7800, lunum: 3 });
	});
});
