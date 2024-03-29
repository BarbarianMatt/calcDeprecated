(function (root) {

	root.dieSides = 10;

	root.BattleType = {
		Space: 'Space',
		Ground: 'Ground',
	};

	root.BattleSide = {
		attacker: 'attacker',
		defender: 'defender',
		opponent: function (battleSide) {
			return {
				attacker: 'defender',
				defender: 'attacker',
			}[battleSide];
		}
	};

	root.SideUnits = {
		attacker: 'attackerUnits',
		defender: 'defenderUnits',
	};
	var UnitType = {
		Flagship: 'Flagship',
		WarSun: 'WarSun',
		Dreadnought: 'Dreadnought',
		Cruiser: 'Cruiser',
		Carrier: 'Carrier',
		Destroyer: 'Destroyer',
		Fighter: 'Fighter',
		Mech: 'Mech',
		Ground: 'Ground',
		PDS: 'PDS',
	};
	
	root.UnitType = UnitType;

	var shortUnitType = {
		Flagship: 'X',
		WarSun: 'W',
		Dreadnought: 'D',
		Cruiser: 'C',
		Destroyer: '+',
		Carrier: 'V',
		Fighter: 'F',
		Ground: 'G',
		Mech: 'M',
		PDS: 'P',
		GhostHit:'T',
	};

	root.Race = {
		Arborec: 'Arborec',
		Creuss: 'Creuss',
		Hacan: 'Hacan',
		JolNar: 'JolNar',
		L1Z1X: 'L1Z1X',
		Letnev: 'Letnev',
		Mentak: 'Mentak',
		Muaat: 'Muaat',
		Naalu: 'Naalu',
		Saar: 'Saar',
		Sardakk: 'Sardakk',
		Sol: 'Sol',
		Virus: 'Virus',
		Winnu: 'Winnu',
		Xxcha: 'Xxcha',
		Yin: 'Yin',
		Yssaril: 'Yssaril',
		Argent: 'Argent',
		Empyrean: 'Empyrean',
		Mahact: 'Mahact',
		NaazRokha: 'NaazRokha',
		Nomad: 'Nomad',
		Titans: 'Titans',
		Cabal: 'Cabal',
	};

	root.RacesDisplayNames = {
		Arborec: 'Arborec',
		Creuss: 'Creuss',
		Hacan: 'Hacan',
		JolNar: 'Jol-Nar',
		L1Z1X: 'L1Z1X',
		Letnev: 'Letnev',
		Mentak: 'Mentak',
		Muaat: 'Muaat',
		Naalu: 'Naalu',
		Virus: 'Nekro Virus',
		Saar: 'Saar',
		Sardakk: 'Sardakk N\'orr',
		Sol: 'Sol',
		Winnu: 'Winnu',
		Xxcha: 'Xxcha',
		Yin: 'Yin',
		Yssaril: 'Yssaril',
		Argent: 'Argent Flight',
		Empyrean: 'Empyrean',
		Mahact: 'Mahact',
		NaazRokha: 'Naaz-Rokha',
		Nomad: 'Nomad',
		Titans: 'Titans of Ul',
		Cabal: "Vuil'Raith Cabal",
	};

	function Option(title, description, limitedTo) {
		this.title = title;
		this.description = description;
		this.limitedTo = limitedTo;
	}

	Option.prototype.availableFor = function (battleSide) {
		return this.limitedTo === undefined || this.limitedTo === battleSide;
	};
	
	root.ActionCards = {
		moraleBoost: new Option('Morale Boost 1st round', '+1 dice modifier to all units during the first battle round'),
		fireTeam: new Option('Fire Team 1st round', 'Reroll dice after first round of invasion combat'),
		fighterPrototype: new Option('Fighter Prototype', '+2 dice modifier to Fighters during the first battle round'),
		bunker: new Option('Bunker', '-4 dice modifier to Bombardment rolls', 'defender'),
		experimentalBattlestation: new Option('Experimental Battlestation', 'Additional unit with Space Cannon 5(x3)'),
		maneuveringJets: new Option('Maneuvering Jets', 'Cancel 1 Space Cannon hit'),
		maneuveringJets2A: new Option('Maneuvering Jets', 'Cancel 1 Space Cannon hit','attacker'),
		maneuveringJets3A: new Option('Maneuvering Jets', 'Cancel 1 Space Cannon hit','attacker'),
		maneuveringJets4A: new Option('Maneuvering Jets', 'Cancel 1 Space Cannon hit','attacker'),
		maneuveringJets2D: new Option('Maneuvering Jets', 'Cancel 1 Space Cannon hit','defender'),
		maneuveringJets3D: new Option('Maneuvering Jets', 'Cancel 1 Space Cannon hit','defender'),
		maneuveringJets4D: new Option('Maneuvering Jets', 'Cancel 1 Space Cannon hit','defender'),
		riskDirectHit: new Option('Risk Direct Hit', 'Damage units vulnerable to Direct Hit before killing off fodder'),
		disable: new Option('Disable', "Defender's PDS lose Planetary Shield and Space Cannon", 'attacker'),
		blitz: new Option('Blitz', 'Each non-fighter ship without Bombardment gains Bombardment 6', 'attacker'),
		reflectiveShielding: new Option('Reflective Shielding', 'Produce 2 hits when one of your ships uses Sustain Damage'),
		solarFlare: new Option('Solar Flare', 'Other players cannot use SPACE CANNON against your ships'),
		waylay: new Option('Waylay', 'Hits from anti-fighter barrage are produced against all ships'),
		directHit: new Option('Direct Hit', "After another player's ship uses Sustain Damage, destroy that ship"),
		directHit2A: new Option('Direct Hit', "After another player's ship uses Sustain Damage, destroy that ship", 'attacker'),
		directHit3A: new Option('Direct Hit', "After another player's ship uses Sustain Damage, destroy that ship", 'attacker'),
		directHit4A: new Option('Direct Hit', "After another player's ship uses Sustain Damage, destroy that ship", 'attacker'),
		directHit2D: new Option('Direct Hit', "After another player's ship uses Sustain Damage, destroy that ship", 'defender'),
		directHit3D: new Option('Direct Hit', "After another player's ship uses Sustain Damage, destroy that ship", 'defender'),
		directHit4D: new Option('Direct Hit', "After another player's ship uses Sustain Damage, destroy that ship", 'defender'),
	};

	root.Technologies = {
		antimassDeflectors: new Option('Antimass Deflectors', '-1 to opponents\' Space Cannon rolls'),
		gravitonLaser: new Option('Graviton Laser System', 'Space Cannon hits should be applied to non-fighters if possible'),
		plasmaScoring: new Option('Plasma Scoring', 'One additional die for one unit during Space Cannon or Bombardment'),
		magenDefense: new Option('Magen Defense Grid', 'Opponent doesn\'t throw dice for one round if you have Planetary Shield', 'defender'),
		x89Omega: new Option('X-89 Bacterial Weapon Ω', 'Destroy all by bombardment if at least one destroyed', 'attacker'),
		magenDefenseOmega: new Option('Magen Defense Grid Ω', '1 hit at the start of ground combat when having structures', 'defender'),
		hasDock: new Option('Has Dock', 'Defender has a dock for Magen Defence Grid Ω', 'defender'), // not a technology itself, but it's nice to show it close to Magen Defence Grid Ω
		x89Conservative: new Option('Assign X-89 Hits Conservatively', 'Sacrifice other Ground Forces if it prevents X-89 Bacterial Weapon Ω from activating', 'defender'),
		duraniumArmor: new Option('Duranium Armor', 'After each round repair 1 unit that wasn\'t damaged this round'),
		assaultCannon: new Option('Assault Cannon', 'Opponent destroys 1 non-Fighter ship if you have at least 3 non-Fighters'),
	};
	root.Agendas = {
		publicizeSchematics: new Option('Publicize Weapon Schematics', 'War Suns don\'t sustain damage'),
		conventionsOfWar: new Option('Conventions of War', 'No bombardment', 'defender'),
		prophecyOfIxth: new Option('Prophecy of IXTH', '+1 to Fighters rolls'),
		articlesOfWar: new Option('Articles of War', 'All Mechs lose their printed abilities except Sustain Damage'),
	};
	
	root.Promissory = {
		letnevMunitionsFunding: new Option('Munitions Reserves / War Funding 1st round', 'Reroll dice during first space combat round'),
		tekklarLegion: new Option('Tekklar Legion', '+1 in invasion combat. -1 to Sardakk if he\'s the opponent'),
		argentStrikeWing: new Option('Strike Wing Ambuscade', 'One additional die for one unit during Space Cannon, Bombardment, or Anti-Fighter Barrage'),
		argentStrikeWingBombardmentA: new Option('Strike Wing Bombardment', 'Use Strike Wind Ambuscade on your Bombardment roll','attacker'),
		argentStrikeWingSpaceCannonA: new Option('Strike Wing Space Cannon', 'Use Strike Wind Ambuscade on your Space Cannon roll','attacker'),
		argentStrikeWingBarrageA: new Option('Strike Wing Anti-Fighter Barrage', 'Use Strike Wind Ambuscade on your Anti-Fighter Barrage roll','attacker'),
		argentStrikeWingSpaceCannonD: new Option('Strike Wing Space Cannon', 'Use Strike Wind Ambuscade on your Space Cannon roll','defender'),
		argentStrikeWingBarrageD: new Option('Strike Wing Anti-Fighter Barrage', 'Use Strike Wind Ambuscade on your Anti-Fighter Barrage roll','defender'),
		nomadCavalry: new Option('The Cavalry', 'Weakest non-fighter ship gains the Sustain Damage ability, Combat value, and Anti-Fighter Barrage value of the Nomad Flagship. Cannot be used against the Nomad' ),
		hasMemoriaIIA: new Option('Has Memoria II', 'The Nomad has Memoria II', 'attacker'),
		hasMemoriaIID: new Option('Has Memoria II', 'The Nomad has Memoria II','defender'),
	};

	root.Miscellaneous = {
		nebula: new Option('In a Nebula', 'Defender receives +1 modifier for all ships', 'defender'),
	};

	root.Leaders = {
		argentCommander: new Option('Argent Flight Commander', 'One additional die for one unit during Space Cannon, Bombardment, and Anti-Fighter Barrage'),
		jolnarCommander: new Option('Jol-Nar Commander', 'Reroll Space Cannon, Bombardment, or Anti-Fighter Barrage dice'),
		L1Z1XCommander: new Option('L1Z1X Commander', 'All units ignore planerary shield', 'attacker'),
		letnevCommander: new Option('Barony of Letnev Commander', 'Gain 1 trade good when one of your units uses Sustain Damage'),
		solCommander: new Option('Sol Commander', 'At the start of ground combat, place one infantry'),
		winnuCommander: new Option('Winnu Commander', '+2 dice modifier to all units in the Mecatol Rex system, your home system, and each system that contains a legendary planet'),
		letnevAgent: new Option('Letnev Agent 1st Round', 'One additional die for one ship during the first round of space combat'),
		solAgent: new Option('Sol Agent 1st Round', 'One additional die for one ground force during the first round of ground combat'),
		titanAgent: new Option('Titan of Ul Agent', 'Cancel one hit'),
		yinAgent: new Option('Yin Agent', 'This player gains 2 fighters on the first destruction of either one of their cruisers or destroyers'),
	};
	root.Heroes = {
		Mentak: {
			mentakHero: new Option('Mentak Hero', 'For every enemy ship destroyed, gain 1 of that ship type onto your side of the battle'),
		},
	};
	root.RaceSpecificTechnologies = {
		Letnev: {
			nonEuclidean: new Option('Non-Euclidean Shielding', 'Sustain Damage absorbs 2 hits'),
			l4Disruptors: new Option('L4 Disruptors', 'During an Invasion units cannot use Space Cannon against you', 'attacker'),
		},
		Sardakk: {
			valkyrieParticleWeave: new Option('Valkyrie Particle Weave', 'If opponent produces at least one hit in Ground combat, you produce one additional hit'),
		},
		NaazRokha: {
			supercharger: new Option('Supercharger', '+1 dice modifier to all units during the first battle round'),
		},
		
	};
	root.RacialSpecific ={
		Virus: {
			opponentTech: new Option("Has Opponent's Faction Technonology", "Mechs apply +2 to the result of their combat rolls if Nekro has an 'X' or 'Y' token on 1 or more of the opponent's technologies"),
		},
		Naalu: {
			opponentRelicFragment: new Option("Opponent Has a Relic Fragment", "Mechs apply +2 to the result of their combat rolls if Naalu's opponent has a relic fragment"),
		},
		Mahact:{
			opponentNoToken: new Option("Opponent's Command Token Not in Fleet Pool", "Flagship applys +2 to the result of its combat rolls against an opponent whose command token is not in Mahact's fleet pool"),
		},
	}
	
	root.UnitInfo = (function () {

		function UnitInfo(type, stats) {

			this.type = type;
			var shortType = shortUnitType[this.type];
			this.shortType = stats.isDamageGhost ? (shortType === "+" ? '-': shortType.toLowerCase()) : shortType;

			this.battleValue = stats.battleValue || NaN;
			this.battleDice = stats.battleDice !== undefined ? stats.battleDice : 1;

			this.bombardmentValue = stats.bombardmentValue || NaN;
			this.bombardmentDice = stats.bombardmentDice || 0;

			this.spaceCannonValue = stats.spaceCannonValue || NaN;
			this.spaceCannonDice = stats.spaceCannonDice || 0;

			this.barrageValue = stats.barrageValue || NaN;
			this.barrageDice = stats.barrageDice || 0;

			this.sustainDamageHits = stats.sustainDamageHits || 0;
			this.isDamageGhost = stats.isDamageGhost || false;

			this.damageCorporeal = undefined;
			this.damaged = false;
			this.damagedThisRound = false;

			this.race = stats.race;
			this.cost = stats.cost;

			var list = [
				UnitType.Flagship,
				UnitType.WarSun,
				UnitType.Dreadnought,
				UnitType.Cruiser,
				UnitType.Destroyer,
				UnitType.Carrier,
				UnitType.Fighter,
			];
			this.typeShip = stats.typeShip || list.includes(type);
			this.typeGroundForce = stats.typeGroundForce || type === root.UnitType.Mech || type === root.UnitType.Ground;
			this.typeStructure = stats.typeStructure || type === root.UnitType.PDS;
			this.planetaryShield = stats.planetaryShield || type === root.UnitType.PDS;
			this.importance = stats.importance || NaN;
			this.cancelHit = stats.cancelHit || NaN;
		}

		UnitInfo.prototype.clone = function () {
			return new UnitInfo(this.type, this);
		};

		// Create damage ghost for damageable units 
		UnitInfo.prototype.toDamageGhost = function () {
			var result = new UnitInfo(this.type, {
				sustainDamageHits: this.sustainDamageHits,
				battleDice: 0,
				isDamageGhost: true,
				typeShip: this.typeShip,
				typeGroundForce: this.typeGroundForce,
				typeStructure: this.typeStructure,
				planetaryShield: this.planetaryShield,
			});
			// 'corporeal' as an antonym to 'ghost' =)
			result.damageCorporeal = this;
			this.damaged = false;
			this.damagedThisRound = false;
			return result;
		};
		return UnitInfo;
	})();

	// These correspond to fields of UnitInfo, like 'battleValue', 'bombardmentValue' etc. 
	root.ThrowType = {
		Battle: 'battle',
		Bombardment: 'bombardment',
		SpaceCannon: 'spaceCannon',
		Barrage: 'barrage',
	};
	root.ThrowValues = {
		battle: 'battleValue',
		bombardment: 'bombardmentValue',
		spaceCannon: 'spaceCannonValue',
		barrage: 'barrageValue',
	};
	root.ThrowDice = {
		battle: 'battleDice',
		bombardment: 'bombardmentDice',
		spaceCannon: 'spaceCannonDice',
		barrage: 'barrageDice',
	};

	root.StandardUnits = {
		WarSun: new root.UnitInfo(UnitType.WarSun, {
			sustainDamageHits: 1,
			battleValue: 3,
			battleDice: 3,
			bombardmentValue: 3,
			bombardmentDice: 3,
			cost: 12,
		}),
		Dreadnought: new root.UnitInfo(UnitType.Dreadnought, {
			sustainDamageHits: 1,
			battleValue: 5,
			bombardmentValue: 5,
			bombardmentDice: 1,
			cost: 4,
		}),
		Cruiser: new root.UnitInfo(UnitType.Cruiser, {
			battleValue: 7,
			cost: 2,
		}),
		Carrier: new root.UnitInfo(UnitType.Carrier, {
			battleValue: 9,
			cost: 3,
		}),
		Destroyer: new root.UnitInfo(UnitType.Destroyer, {
			battleValue: 9,
			barrageValue: 9,
			barrageDice: 2,
			cost: 1,
		}),
		Fighter: new root.UnitInfo(UnitType.Fighter, {
			battleValue: 9,
			cost: 0.5,
		}),
		PDS: new root.UnitInfo(UnitType.PDS, {
			spaceCannonValue: 6,
			spaceCannonDice: 1,
		}),
		Ground: new root.UnitInfo(UnitType.Ground, {
			battleValue: 8,
			cost: 0.5,
		}),
		Mech: new root.UnitInfo(UnitType.Mech, {
			sustainDamageHits: 1,
			battleValue: 6,
			cost: 2,
		}),
		ExperimentalBattlestation: new root.UnitInfo('Bloodthirsty Space Dock', {
			spaceCannonValue: 5,
			spaceCannonDice: 3,
		}),
		GhostHit: new root.UnitInfo('Ghost Hit', {
			battleDice: 0,
		}),
	};

	root.RaceSpecificUnits = {
		Sardakk: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 6,
				battleDice: 2,
				race: root.Race.Sardakk,
				cost: 8,
			}),
			Dreadnought: new root.UnitInfo(UnitType.Dreadnought, {
				sustainDamageHits: 1,
				battleValue: 5,
				bombardmentValue: 4,
				bombardmentDice: 2,
				cost: 4,
			}),
		},
		JolNar: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 6,
				battleDice: 2,
				race: root.Race.JolNar,
				cost: 8,
			}),
		},
		Winnu: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 7,
				battleDice: undefined,
				race: root.Race.Winnu,
				cost: 8,
			}),
		},
		Xxcha: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 7,
				battleDice: 2,
				spaceCannonValue: 5,
				spaceCannonDice: 3,
				race: root.Race.Xxcha,
				cost: 8,
			}),
			Mech: new root.UnitInfo(UnitType.Mech, {
				sustainDamageHits: 1,
				battleValue: 6,
				spaceCannonValue: 8,
				spaceCannonDice: 1,
				cost: 2,
			}),
		},
		Yin: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 9,
				battleDice: 2,
				race: root.Race.Yin,
				cost: 8,
			}),
		},
		Yssaril: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 5,
				battleDice: 2,
				race: root.Race.Yssaril,
				cost: 8,
			}),
		},
		Sol: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 5,
				battleDice: 2,
				race: root.Race.Sol,
				cost: 8,
			}),
			Ground: new root.UnitInfo(UnitType.Ground, {
				battleValue: 7,
				cost: 0.5,
			}),
		},
		Creuss: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 5,
				battleDice: 1,
				race: root.Race.Creuss,
				cost: 8,
			}),
		},
		L1Z1X: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 5,
				battleDice: 2,
				race: root.Race.L1Z1X,
				cost: 8,
			}),
			Mech: new root.UnitInfo(UnitType.Mech, {
				sustainDamageHits: 1,
				battleValue: 6,
				bombardmentValue: 8,
				bombardmentDice: 1,
				cost: 2,
			}),
		},
		Mentak: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 7,
				battleDice: 2,
				race: root.Race.Mentak,
				cost: 8,
			}),
		},
		Naalu: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 9,
				battleDice: 2,
				race: root.Race.Naalu,
				cost: 8,
			}),
			Fighter: new root.UnitInfo(UnitType.Fighter, {
				battleValue: 8,
				cost: 0.5,
			}),
		},
		Virus: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 9,
				battleDice: 2,
				race: root.Race.Virus,
				cost: 8,
			}),
		},
		Arborec: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 7,
				battleDice: 2,
				race: root.Race.Arborec,
				cost: 8,
			}),
			Mech: new root.UnitInfo(UnitType.Mech, {
				sustainDamageHits: 1,
				battleValue: 6,
				cost: 2,
				planetaryShield: true,
			}),
		},
		Letnev: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 5,
				battleDice: 2,
				bombardmentValue: 5,
				bombardmentDice: 3,
				race: root.Race.Letnev,
				cost: 8,
			}),
		},
		Saar: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 5,
				battleDice: 2,
				barrageValue: 6,
				barrageDice: 4,
				race: root.Race.Saar,
				cost: 8,
			}),
		},
		Muaat: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 5,
				battleDice: 2,
				race: root.Race.Muaat,
				cost: 8,
			}),
		},
		Hacan: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 7,
				battleDice: 2,
				race: root.Race.Hacan,
				cost: 8,
			}),
		},
		Argent: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 7,
				battleDice: 2,
				race: root.Race.Argent,
				cost: 8,
			}),
			Destroyer: new root.UnitInfo(UnitType.Destroyer, {
				battleValue: 8,
				barrageValue: 9,
				barrageDice: 2,
				cost: 1,
			}),
		},
		Empyrean: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 5,
				battleDice: 2,
				race: root.Race.Empyrean,
				cost: 8,
			}),
		},
		Mahact: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 5,
				battleDice: 2,
				race: root.Race.Mahact,
				cost: 8,
			}),
		},
		NaazRokha: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 9,
				battleDice: 2,
				race: root.Race.NaazRokha,
				cost: 8,
			}),
			Mech: new root.UnitInfo(UnitType.Mech, {
				sustainDamageHits: 1,
				battleValue: 6,
				battleDice: 2,
				importance: 1.6,
				cost: 2,
				typeShip: true,
			}),
		},
		Nomad: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 7,
				battleDice: 2,
				barrageValue: 8,
				barrageDice: 3,
				race: root.Race.Nomad,
				cost: 8,
			}),
		},
		Titans: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 7,
				battleDice: 2,
				race: root.Race.Titans,
				cost: 8,
			}),
			Cruiser: new root.UnitInfo(UnitType.Cruiser, {
				battleValue: 7,
				cost: 2,
			}),
			PDS: new root.UnitInfo(UnitType.PDS, {
				sustainDamageHits: 1,
				battleValue: 7,
				spaceCannonValue: 6,
				spaceCannonDice: 1,
				typeGroundForce: true,
			}), 
		},
		Cabal: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 5,
				battleDice: 2,
				bombardmentValue: 5,
				bombardmentDice: 1,
				race: root.Race.Cabal,
				cost: 8,
			}),
		},
	};

	root.StandardUpgrades = {
		// same as the regular Dreadnought, but upgrade affects ordering
		Dreadnought: new root.UnitInfo(UnitType.Dreadnought, {
			sustainDamageHits: 1,
			battleValue: 5,
			bombardmentValue: 5,
			bombardmentDice: 1,
			cost: 4,
		}),
		Cruiser: new root.UnitInfo(UnitType.Cruiser, {
			battleValue: 6,
			cost: 2,
		}),
		Destroyer: new root.UnitInfo(UnitType.Destroyer, {
			battleValue: 8,
			barrageValue: 6,
			barrageDice: 3,
			cost: 1,
		}),
		Fighter: new root.UnitInfo(UnitType.Fighter, {
			battleValue: 8,
			cost: 0.5,
		}),
		PDS: new root.UnitInfo(UnitType.PDS, {
			spaceCannonValue: 5,
			spaceCannonDice: 1,
		}),
		Ground: new root.UnitInfo(UnitType.Ground, {
			battleValue: 7,
			cost: 0.5,
		}),
	};

	root.RaceSpecificUpgrades = {
		Sol: {
			Carrier: new root.UnitInfo(UnitType.Carrier, {
				sustainDamageHits: 1,
				battleValue: 9,
				cost: 3,
			}),
			Ground: new root.UnitInfo(UnitType.Ground, {
				battleValue: 6,
				cost: 0.5,
			}),
		},
		L1Z1X: {
			Dreadnought: new root.UnitInfo(UnitType.Dreadnought, {
				sustainDamageHits: 1,
				battleValue: 4,
				bombardmentValue: 4,
				bombardmentDice: 1,
				cost: 4,
			}),
		},
		Naalu: {
			Fighter: new root.UnitInfo(UnitType.Fighter, {
				battleValue: 7,
				cost: 0.5,
			}),
		},
		Muaat: {
			WarSun: new root.UnitInfo(UnitType.WarSun, {
				sustainDamageHits: 1,
				battleValue: 3,
				battleDice: 3,
				bombardmentValue: 3,
				bombardmentDice: 3,
				cost: 10,
			}),
		},
		Argent: {
			Destroyer: new root.UnitInfo(UnitType.Destroyer, {
				battleValue: 7,
				barrageValue: 6,
				barrageDice: 3,
				cost: 1,
			}),
		},
		Nomad: {
			Flagship: new root.UnitInfo(UnitType.Flagship, {
				sustainDamageHits: 1,
				battleValue: 5,
				battleDice: 2,
				barrageValue: 5,
				barrageDice: 3,
				race: root.Race.Nomad,
				cost: 8,
			}),
		},
		Titans: {
			Cruiser: new root.UnitInfo(UnitType.Cruiser, {
				sustainDamageHits: 1,
				battleValue: 6,
				cost: 2,
			}),
			PDS: new root.UnitInfo(UnitType.PDS, {
				sustainDamageHits: 1,
				battleValue: 6,
				spaceCannonValue: 5,
				spaceCannonDice: 1,
				typeGroundForce: true,
			}), 
		},
	};

	root.MergedUnits = {};
	root.MergedUpgrades = {};
	for (var race in root.Race) {
		root.MergedUnits[race] = Object.assign({}, root.StandardUnits, root.RaceSpecificUnits[race]);
		root.MergedUpgrades[race] = Object.assign({}, root.StandardUpgrades, root.RaceSpecificUpgrades[race]);
	}
	
	// Make an array of units in their reversed order of dying 
	root.expandFleet = function (input, battleSide) {
		var options = input.options || { attacker: {}, defender: {} };
		var battleType = input.battleType;
		var thisSideOptions = options[battleSide];
		var opponentSide = root.BattleSide.opponent(battleSide);
		var opponentSideOptions = options[opponentSide];

		var standardUnits = root.MergedUnits[thisSideOptions.race];
		var upgradedUnits = root.MergedUpgrades[thisSideOptions.race];

		var opponentMentakFlagship = battleType === root.BattleType.Space && opponentSideOptions.race === root.Race.Mentak &&
			(input[root.SideUnits[opponentSide]][UnitType.Flagship] || { count: 0 }).count !== 0;
		var opponentMentakMech = battleType === root.BattleType.Ground && opponentSideOptions.race === root.Race.Mentak &&
			(input[root.SideUnits[opponentSide]][UnitType.Mech] || { count: 0 }).count !== 0 && !opponentSideOptions.articlesOfWar;

		var virusFlagship = battleType === root.BattleType.Space && thisSideOptions.race === root.Race.Virus &&
			(input[root.SideUnits[battleSide]][UnitType.Flagship] || { count: 0 }).count !== 0;
		var naaluFlagship = battleType === root.BattleType.Ground && thisSideOptions.race === root.Race.Naalu &&
			(input[root.SideUnits[battleSide]][UnitType.Flagship] || { count: 0 }).count !== 0;

		var result = [];
		var thisSideCounters = input[root.SideUnits[battleSide]];
	
		for (var unitType in UnitType) {
			var counter = thisSideCounters[unitType] || { count: 0 };
			
			if (!((unitType === UnitType.Mech && options.attacker.race === 'L1Z1X') || (unitType === UnitType.Flagship && thisSideOptions.race === 'Xxcha')))
				counter.participants = counter.participants ? 0: counter.participants;
				
			for (var i = 0; i < counter.count; i++) {
				var unit = (counter.upgraded ? upgradedUnits : standardUnits)[unitType];
				var addedUnit = unit.clone();
				if (naaluFlagship && unit.type === root.UnitType.Fighter && battleSide === 'attacker')
					addedUnit.typeGroundForce=true;
				if (virusFlagship && unit.typeGroundForce)
					addedUnit.typeShip=true;
				if ((thisSideOptions.articlesOfWar || battleType === root.BattleType.Ground) && unit.type === root.UnitType.Mech && thisSideOptions.race === root.Race.NaazRokha)
					addedUnit.typeShip=false;
				if (thisSideOptions.articlesOfWar && unit.type === root.UnitType.Mech && thisSideOptions.race === root.Race.Xxcha){
					addedUnit.spaceCannonDice=0;
					addedUnit.spaceCannonValue=null;
				}
				if (thisSideOptions.blitz && addedUnit.bombardmentDice === 0 && unit.typeShip && addedUnit.type !== root.UnitType.Fighter){
					addedUnit.bombardmentDice=1;
					addedUnit.bombardmentValue=6;
				}
				if (opponentSideOptions.disable && unit.type === root.UnitType.PDS){
					addedUnit.spaceCannonDice=0;
					addedUnit.planetaryShield=false;
				}
				result.push(addedUnit);
				if (unit.sustainDamageHits > 0 &&
					!opponentMentakFlagship &&
					!(unitType === UnitType.WarSun && thisSideOptions.publicizeSchematics) &&
					!(unitType === UnitType.Mech && opponentMentakMech && battleType===root.BattleType.Ground) &&
					!(unitType === UnitType.Mech && thisSideOptions.race===root.Race.NaazRokha && battleType===root.BattleType.Space)
				) {
					if (i < counter.count - Math.max((counter.damaged || 0),(counter.participants || 0))){
						sustain=addedUnit.toDamageGhost()
						if (sustain.type === root.UnitType.Mech && thisSideOptions.race === root.Race.Nomad)
							sustain.cancelHit=true;
						result.push(sustain);
					}
					else
						addedUnit.damaged = true;
				}

			}
		}
		if (thisSideOptions.titanAgent){
			var ghostHit = root.StandardUnits.GhostHit;
			ghostHit.shortType='T',
			ghostHit.cancelHit=true;
			result.push(ghostHit);
		}
		thisSideOptions.yinAgentUses= thisSideOptions.yinAgent ? 1 : 0 ;
		if (battleSide === "attacker"){
			thisSideOptions.maneuveringJetsUses = 0 + thisSideOptions.maneuveringJets + thisSideOptions.maneuveringJets2A + thisSideOptions.maneuveringJets3A + thisSideOptions.maneuveringJets4A;
			thisSideOptions.directHitUses=0+thisSideOptions.directHit+thisSideOptions.directHit2A+thisSideOptions.directHit3A+thisSideOptions.directHit4A;
		}
		if (battleSide === "defender"){
			thisSideOptions.maneuveringJetsUses = 0 + thisSideOptions.maneuveringJets + thisSideOptions.maneuveringJets2D + thisSideOptions.maneuveringJets3D + thisSideOptions.maneuveringJets4D;
			thisSideOptions.directHitUses=0+thisSideOptions.directHit+thisSideOptions.directHit2D+thisSideOptions.directHit3D+thisSideOptions.directHit4D;
		}
		if (thisSideOptions.race !== root.Race.Nomad && opponentSideOptions.race !== root.Race.Nomad && battleType === root.BattleType.Space){
			
			if (battleSide === "attacker" && options.attacker.nomadCavalry){
				thisSideOptions.hasMemoriaIIA ? nomadPromissary(result,2) : nomadPromissary(result,1);
			}
			if (battleSide === "defender" && options.defender.nomadCavalry)
				thisSideOptions.hasMemoriaIID ? nomadPromissary(result,2) : nomadPromissary(result,1);	
		}
		
		var unitOrder = createUnitOrder(virusFlagship);
		var naaluGoundUnitOrder = {};
		naaluGoundUnitOrder[UnitType.Mech] = 0;
		naaluGoundUnitOrder[UnitType.Ground] = 1;
		naaluGoundUnitOrder[UnitType.Fighter] = 2;
		var comparer;
		var vipGround;
		if (naaluFlagship) {
			// in case Fighters are stronger than Ground Forces, I'd like Ground Forces to die first, then sacrifice the
			// Fighters. But, Fighters cannot take control of the planet, so I'd like to save one Ground Force
			vipGround = (thisSideCounters[UnitType.Fighter] || {}).upgraded &&
				!(thisSideCounters[UnitType.Ground] || {}).upgraded &&
				(result.find(function (unit) { return unit.type === UnitType.Mech;}) || result.find(function (unit) { return unit.type === UnitType.Ground;}));
			comparer = naaluComparer;
		} else if ((thisSideCounters[UnitType.Dreadnought] || {}).upgraded){
			comparer = upgradedDreadnoughtsComparer;
		}else
			comparer = defaultComparer;
		result.sort(comparer);
		if (battleType === root.BattleType.Space && thisSideOptions.experimentalBattlestation)
			result.push(root.StandardUnits.ExperimentalBattlestation);
		result.comparer = comparer;
		result.filterForBattle = filterFleet;
		return result;

		function createUnitOrder(virus) {
			var result = [];
			var i = 0;
			for (var unitType in UnitType) {
				result[unitType] = i++;
			}
			if (virus) {
				var tmp = result[UnitType.Ground]; // Virus will need Grounds to die after Fighters, as they are stronger
				result[UnitType.Ground] = result[UnitType.Fighter];
				result[UnitType.Fighter] = tmp;
				tmp = result[UnitType.Mech]; // Virus will need Mechs to die after Grounds, as they are stronger
				result[UnitType.Mech] = result[UnitType.Ground];
				result[UnitType.Ground] = tmp;
			}
			return result;
		}
		function defaultComparer(unit1, unit2) {
			var unitOrder1= isNaN(unit1.importance) ? unitOrder[unit1.type] : unit1.importance;
			var unitOrder2=isNaN(unit2.importance) ? unitOrder[unit2.type] : unit2.importance;
			var typeOrder = unitOrder1 - unitOrder2;
			// damage ghosts come after corresponding units
			var damageGhostOrder = (unit1.isDamageGhost ? 1 : 0) - (unit2.isDamageGhost? 1 : 0);
			// Damaged units come _before_ undamaged ones (within one type of course), which means they die later,
			// this way more Duranium armor has better chance to be applied.
			var damagedOrder = (unit2.damaged ? 1 : 0) - (unit1.damaged ? 1 : 0);
			if (thisSideOptions.riskDirectHit) {
				// means damage ghosts will come last
				var defaultComparison = damageGhostOrder * 1000 + typeOrder * 10 + damagedOrder;
				if (thisSideOptions.race !== root.Race.Letnev) {
					return defaultComparison;
				} else {
					// damage ghosts will still come last, but Flagship ghost should be the very very last, as the Flagship can repair itself
					if (unit1.type === UnitType.Flagship && unit1.isDamageGhost) {
						return unit2.type === UnitType.Flagship && unit2.isDamageGhost ? 0 : 1;
					} else if (unit2.type === UnitType.Flagship && unit2.isDamageGhost) {
						return -1;
					} else {
						return defaultComparison;
					}
				}
			} else {
				// means units are grouped with their damage ghosts
				if (!unit1.typeShip && unit1.isDamageGhost)
					return 1;
				if (!unit2.typeShip && unit2.isDamageGhost)
					return -1;
				return typeOrder * 1000 + damageGhostOrder * 10 + damagedOrder;
			}
		}

		function upgradedDreadnoughtsComparer(unit1, unit2) {
			if (thisSideOptions.riskDirectHit) {
				return defaultComparer(unit1, unit2);
			} else if (unit1.type === UnitType.Dreadnought && unit1.isDamageGhost) {
				return unit2.type === UnitType.Dreadnought && unit2.isDamageGhost ? 0 : 1;
			} else if (unit2.type === UnitType.Dreadnought && unit2.isDamageGhost) {
				return -1;
			} else {
				return defaultComparer(unit1, unit2);
			}
		}

		function naaluComparer(unit1, unit2) {
			var typeOrder = naaluGoundUnitOrder[unit1.type] - naaluGoundUnitOrder[unit2.type];
			var damageGhostOrder = (unit1.isDamageGhost ? 1 : 0) - (unit2.isDamageGhost ? 1 : 0);
			var damagedOrder = (unit2.damaged ? 1 : 0) - (unit1.damaged ? 1 : 0);
			if (vipGround) {
				// Fighters are stronger than Ground
				if (unit1 === vipGround)
					return -1;
				else if (unit2 === vipGround)
					return 1;
				else
					if (!unit1.typeShip && unit1.isDamageGhost)
						return 1;
					if (!unit2.typeShip && unit2.isDamageGhost)
						return -1;
					return -(typeOrder * 1000 + damageGhostOrder * 10 + damagedOrder);
			} else {
				if (!unit1.typeShip && unit1.isDamageGhost)
					return 1;
				if (!unit2.typeShip && unit2.isDamageGhost)
					return -1;
				return (typeOrder * 1000 + damageGhostOrder * 10 + damagedOrder);
			}
		}
		function nomadPromissary(fleet,level){
			var unitPriority = -1;
			var unit = null;
			var perfer = [root.UnitType.Warsun, root.UnitType.Flagship, root.UnitType.Dreadnought, root.UnitType.Mech, root.UnitType.Cruiser,root.UnitType.Ground, root.UnitType.Destroyer, root.UnitType.Carrier];
			
			for (var i = 0; i < fleet.length; i++) {
				if (!fleet[i].isDamageGhost && fleet[i].type !== root.UnitType.Fighter && fleet[i].typeShip){
					if (perfer.indexOf(fleet[i].type)>unitPriority){
						unit=fleet[i];
						unitPriority=perfer.indexOf(fleet[i].type);
					}
				}
			}
			
			if (level === 1 && unit !== null){
				unit.battleValue=7;
				unit.battleDice=2;
				unit.barrageValue=8;
				unit.barrageDice=3;
				unit.importance=1.5;
				if (unit.sustainDamageHits <1){
					unit.sustainDamageHits=1;
					var ghost = unit.toDamageGhost();
					ghost.importance=1.5;
					fleet.push(ghost);
				}
			} else if (level === 2 && unit !== null) {
				unit.battleValue=5;
				unit.battleDice=2;
				unit.barrageValue=5;
				unit.barrageDice=3;
				unit.importance=1.5;
				if (unit.sustainDamageHits <1){
					unit.sustainDamageHits=1;
					var ghost = unit.toDamageGhost();
					ghost.importance=1.5;
					fleet.push(ghost);
				}
			}
			return;
		}
		function unitIs(unitType) {
			return function (unit) {
				return unit.type === unitType && !unit.isDamageGhost;
			};
		}
		
		function filterFleet() {
			var allowed = {};
			for (var unitType in UnitType){
				var counter = thisSideCounters[unitType] || { count: 0 };
				var par = counter.count - (counter.participants || 0);
				allowed[unitType]=par;
			}
			var result = this.filter(function (unit) {
				allowed[unit.type] = unit.isDamageGhost ? allowed[unit.type] : allowed[unit.type]-1;
				if (battleType === root.BattleType.Space)
					return (unit.typeShip || (unit.type === UnitType.Mech && thisSideOptions.race === root.Race.Nomad && 
						unit.isDamageGhost && !thisSideOptions.articlesOfWar)) && (allowed[unit.type]>=0 || unit.isDamageGhost);
				else battleType === root.BattleType.Ground
					return (unit.typeGroundForce) && (allowed[unit.type]>=0 || unit.isDamageGhost);
			});
			result.comparer = this.comparer;
			if (result.length >0 && thisSideOptions.titanAgent){
				var ghostHit = root.StandardUnits.GhostHit;
				ghostHit.shortType='T',
				result.push(ghostHit);
			}
			if (result.length >0 && thisSideOptions.solCommander && battleType === root.BattleType.Ground){
				var counter = thisSideCounters[root.UnitType.Ground] || { count: 0 }
				var unit = (counter.upgraded ? upgradedUnits : standardUnits)[root.UnitType.Ground];
				result.push(unit);
			}
			return result;
		}

	};

	// Check whether the race has an upgrade for the unit 
	root.upgradeable = function (race, unitType) {
		return !!(root.StandardUpgrades.hasOwnProperty(unitType) ||
			root.RaceSpecificUpgrades[race] &&
			root.RaceSpecificUpgrades[race].hasOwnProperty(unitType));
	};

	root.damageable = function (race, unitType, upgraded) {
		return (upgraded ? root.MergedUpgrades : root.MergedUnits)[race][unitType].sustainDamageHits > 0;
	};
	
})(typeof exports === 'undefined' ? window : exports);
//window.alert(5 + 6);
