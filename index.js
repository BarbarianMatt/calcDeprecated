(function () {

	window.CanvasSizes = [
		{ width: 600, height: 400 },
		{ width: 900, height: 600 },
		{ width: 1200, height: 800 },
		{ width: 1800, height: 1200 },
	];

	var lastComputed;
	var input = getInput();

	var recomputeHandler = {
		handler: 'recompute',
		deep: true,
	};

	var transientProperties = {
		costs: { attacker: { count: 0, cost: 0, }, defender: { count: 0, cost: 0, } },
		tgs: { attacker: { tg:null }, defender: { tg:null } },
		showOptions: false,
		showHelp: false,
		computing: false,
		forceSlow: false, // do `app.forceSlow = true;` in developers console to force slow but robust calculation
	};

	app = new Vue({
		el: '#root',
		data: Object.assign(input, transientProperties),
		methods: {
			increment: function (unitInput) {
				unitInput.count++;
			},
			decrement: function (unitInput) {
				unitInput.count = unitInput.count === 0 ? 0 : unitInput.count - 1;
			},
			displayName: function (unitType) {
				if (unitType === UnitType.WarSun) return 'War Sun';
				else if (unitType === UnitType.Ground) return 'Infantry';
				else return unitType;
			},
			clear: function (side) {
				for (var unitType in UnitType) {
					this[SideUnits[side]][unitType].count = 0;
					this[SideUnits[side]][unitType].upgraded = false;
				}
			},
			recompute: function () {
				this.tallyCosts();
				this.computing = true;
				var self = this;

				persistInput();

				// veeery poor man's background processing
				setTimeout(function () {
					// unfortunately some game aspects are hard to handle in the calculator
					
					n = window;
					var attackerBarrageNum=0;
					var defenderBarrageNum=0;
					var attackerSustainShip=0;
					var defenderSustainShip=0;
					var attackerCancelHits=0;
					var defenderCancelHits=0;
					var attackerFighters=0;
					var defenderFighters=0;
					n.expandFleet(self, n.BattleSide.attacker).forEach(function (unit){
						attackerBarrageNum+=unit.barrageDice;
						attackerSustainShip+=unit.isDamageGhost && unit.typeShip;
						attackerCancelHits+=unit.cancelHit;
						attackerFighters+= unit.type === n.UnitType.Fighter;
					})
					n.expandFleet(self, n.BattleSide.defender).forEach(function (unit){
						defenderBarrageNum+=unit.barrageDice;
						defenderSustainShip+=unit.isDamageGhost && unit.typeShip;
						defenderCancelHits+=!isNaN(unit.cancelHit);
						defenderFighters+= unit.type === n.UnitType.Fighter;
					})
					attackerBarrageNum= self.options.attacker.argentCommander ? attackerBarrageNum+1:attackerBarrageNum;
					attackerBarrageNum= self.options.attacker.argentStrikeWingBarrageA ? attackerBarrageNum+1:attackerBarrageNum;
					defenderBarrageNum= self.options.defender.argentCommander ? defenderBarrageNum+1:defenderBarrageNum;
					attackerBarrageNum= self.options.defender.argentStrikeWingBarrageD ? defenderBarrageNum+1:defenderBarrageNum;
					var duraniumArmor = self.options.attacker.duraniumArmor || self.options.defender.duraniumArmor;
					var l1z1xFlagship = (self.options.attacker.race === Race.L1Z1X && self.attackerUnits.Flagship.count !== 0 ||
						self.options.defender.race === Race.L1Z1X && self.defenderUnits.Flagship.count !== 0) && self.battleType === BattleType.Space;
					var letnevFlagship = (self.options.attacker.race === Race.Letnev && self.attackerUnits.Flagship.count !== 0 ||
						self.options.defender.race === Race.Letnev && self.defenderUnits.Flagship.count !== 0) && self.battleType === BattleType.Space;
					// I could not figure out how to have it so that when sardakk's mechs sustain damage in the normal calculator, only then would they produce a hit, may be possible but IDK
					var sardakkMech = (self.options.attacker.race === Race.Sardakk && self.attackerUnits.Mech.count !== 0 ||
						self.options.defender.race === Race.Sardakk && self.defenderUnits.Mech.count !== 0) && self.battleType === BattleType.Ground && !self.options.attacker.articlesOfWar;
					// Same reason as Sardakk Mechs
					var reflective = (self.options.attacker.reflectiveShielding || self.options.defender.reflectiveShielding);
					// due to the fact that the Raid formation ability only triggers if all the opposing fighters are dead, it can't be used in the normal calculator
					var argentRaid = ((self.options.attacker.race === Race.Argent && attackerBarrageNum>defenderFighters && defenderSustainShip>0) || (self.options.defender.race === Race.Argent && defenderBarrageNum>attackerFighters && attackerSustainShip>0))
					var x89OmegaPresent = self.options.attacker.x89Omega;
					var x89 = false;
					if (x89OmegaPresent){
						n = window;
						n.expandFleet(self, n.BattleSide.defender).forEach(function (unit){
							if (unit.typeGroundForce && unit.type !== n.UnitType.Ground)
								x89 = self.defenderUnits.Ground.count !== 0;
						})
					}
					var mentakH = self.options.attacker.mentakHero || self.options.defender.mentakHero;
					var yinA= self.options.attacker.yinAgent || self.options.defender.yinAgent;
					var letnevC = self.options.attacker.letnevCommander || self.options.defender.letnevCommander;
					var directHit = self.options.attacker.directHit || self.options.defender.directHit;
					var cancelHitBarrage=(attackerBarrageNum>0 && defenderCancelHits>0) || (defenderBarrageNum>0 && attackerCancelHits>0);
					var magenDefenseOmega = self.battleType === BattleType.Ground && self.options.defender.magenDefenseOmega;
					if ((duraniumArmor || l1z1xFlagship || letnevFlagship || sardakkMech || argentRaid || reflective || x89 || mentakH || yinA || letnevC || directHit || cancelHitBarrage || magenDefenseOmega) || self.forceSlow){
						output = imitator.estimateProbabilities(self);
						lastComputed = output[0];
						self.tgs.attacker.tg = output[1];
						self.tgs.defender.tg = output[2];
					}else
						lastComputed = calculator.computeProbabilities(self);

					self.displayDistribution(lastComputed);

					self.computing = false;
				}, 15); // number is magic. but at least the spinner has time to show up before calculation begins
			},
			displayDistribution: function (solution) {

				drawChart(solution);
				
				drawTotalWinProbabilities(solution.distribution);

				return;

				function drawChart(solution) {
					var labels = [];
					var data = [];
					var dataLabels = [];
					var from = Math.min(-8, solution.distribution.min);
					var to = Math.max(8, solution.distribution.max);
					for (var i = from; i <= to; ++i) {
						labels.push(getLabel(i, solution.attacker, solution.defender));
						if (i === 0) {
							data.push(solution.distribution.at(0) * 100);
							dataLabels.push(Math.round(solution.distribution.at(0) * 1000).toString()/10 + '%');
						} else {
							data.push(solution.distribution.downTo(i) * 100);
							dataLabels.push(Math.round(solution.distribution.downTo(i) * 1000).toString()/10 + '%');
						}
					}
					RGraph.clear(document.getElementById('chart-area'));
					RGraph.ObjectRegistry.Clear();

					var line = new RGraph.Line('chart-area', data)
						.Set('labels', labels)
						.Set('chart.background.grid.vlines', true)
						.Set('chart.background.grid.autofit.numvlines', 1)
						.Set('chart.filled', true)
						.Set('chart.tickmarks', 'circle')
						.Set('chart.numxticks', 0)
						.Set('chart.ymax', Math.max.apply(null, data) * 1.08)
						.Set('chart.colors', ['rgba(200,200,256,0.7)']);
					if (to - from < 20)
						line.Set('chart.labels.ingraph', dataLabels);
					else
						line.Set('chart.tooltips', dataLabels);
					line.Draw();

					function getLabel(i, attacker, defender) {
						if (i === 0)
							return '=';
						if (i < 0) {
							i = -i;
							if (i <= attacker.length)
								return attacker[i - 1];
							else
								return '';
						}
						else {
							if (i <= defender.length)
								return defender[i - 1];
							else
								return '';
						}
					}
				}

				function drawTotalWinProbabilities(distribution) {
					var attackerWinProbability = 0;
					var defenderWinProbability = 0;
					var drawProbability = distribution.at(0);
					for (var i = distribution.min; i < 0; i++) {
						attackerWinProbability += distribution.at(i);
					}
					for (var i = 1; i <= distribution.max; i++) {
						defenderWinProbability += distribution.at(i);
					}

					var canvas = document.getElementById('chart-area-overlay');
					RGraph.clear(canvas);
					var context = canvas.getContext('2d');
					var canvasWidth = canvas.width;
					var canvasHeight = canvas.height;
					context.font = 'bold 100px Arial';

					context.fillStyle = 'rgba(256, 100, 100, 0.5)';
					var roundedAttackerProbability = Math.round(attackerWinProbability * 1000)/10;
					context.fillText(roundedAttackerProbability + '%', canvasWidth / 12, 3 * canvasHeight / 4);

					context.fillStyle = 'rgba(100, 100, 256, 0.5)';
					var roundedDefenderProbability = Math.round(defenderWinProbability * 1000)/10;
					context.fillText(roundedDefenderProbability + '%', 7 * canvasWidth / 12, 3 * canvasHeight / 4);

					if (drawProbability > .005 && (roundedAttackerProbability + roundedDefenderProbability) < 100 ) {
						context.font = 'bold 80px Arial';
						context.fillStyle = 'rgba(160, 160, 160, 0.5)';
						context.fillText(Math.round(drawProbability * 1000)/10 + '%', 5 * canvasWidth / 12, 3 * canvasHeight / 8);
					}
				}
			},
			tallyCosts: function () {
				tally(this.costs.attacker, this.attackerUnits, this.options.attacker);
				tally(this.costs.defender, this.defenderUnits, this.options.defender);

				function tally(costs, units, sideOptions) {
					costs.count = 0;
					costs.cost = 0;
					for (var unitType in UnitType) {
						if (unitType === UnitType.PDS) continue;

						var counter = units[unitType];
						costs.count += counter.count;
						costs.cost += (counter.upgraded && MergedUpgrades[sideOptions.race][unitType].cost || MergedUnits[sideOptions.race][unitType].cost) * counter.count;
					}
					//console.log(units[Mech])
				}	
			},
			participates: function (battleSide, unitType) {
				var bombardmentPossible = this.defenderUnits.PDS.count === 0 // either there are no defending PDS
					|| this.attackerUnits.WarSun.count !== 0 // or there are but attacking WarSuns negate their Planetary Shield
					|| this.options.attacker.race === Race.Letnev && this.attackerUnits.Flagship.count !== 0; // Letnev Flagship negates Planetary Shield as well
				switch (unitType) {
					case UnitType.Flagship:
						return this.battleType === BattleType.Space ||
							battleSide === BattleSide.attacker && (this.options.attacker.race === Race.Naalu || this.options.attacker.race === Race.Letnev && !this.options.defender.conventionsOfWar);
					case UnitType.WarSun:
						return this.battleType === BattleType.Space ||
							battleSide === BattleSide.attacker && !this.options.defender.conventionsOfWar;
					case UnitType.Dreadnought:
						return this.battleType === BattleType.Space ||
							battleSide === BattleSide.attacker && bombardmentPossible && !this.options.defender.conventionsOfWar;
					case UnitType.Cruiser:
						return this.battleType === BattleType.Space;
					case UnitType.Carrier:
						return this.battleType === BattleType.Space;
					case UnitType.Destroyer:
						return this.battleType === BattleType.Space;
					case UnitType.Fighter:
						return this.battleType === BattleType.Space ||
							battleSide === BattleSide.attacker && this.options.attacker.race === Race.Naalu && this.attackerUnits.Flagship.count !== 0;
					case UnitType.Ground:
						return this.battleType === BattleType.Ground ||
							this.options[battleSide].race === Race.Virus && this[SideUnits[battleSide]].Flagship.count !== 0;
					case UnitType.Mech:
						return this.battleType === BattleType.Ground || this.options[battleSide].race === Race.NaazRokha || (this.options[battleSide].race === Race.Virus && this[SideUnits[battleSide]].Flagship.count !== 0);
					case UnitType.PDS:
						return this.battleType === BattleType.Space || battleSide === BattleSide.defender;
				}
			},
			damageableCount: function (count) {
				var result = [];
				for (var i = 0; i <= count; i++)
					result.push(i);
				return result;
			},
		},
		watch: {
			'options.attacker.race': resetUpdatesAndTechnologies('attacker'),
			'options.defender.race': resetUpdatesAndTechnologies('defender'),
			'options.attacker.publicizeSchematics': function (value) {
				this.options.defender.publicizeSchematics = value;
			},
			'options.defender.publicizeSchematics': function (value) {
				this.options.attacker.publicizeSchematics = value;
			},
			'options.attacker.articlesOfWar': function (value) {
				this.options.defender.articlesOfWar = value;
			},
			'options.defender.articlesOfWar': function (value) {
				this.options.attacker.articlesOfWar = value;
			},
			'options.defender.magenDefense': function (value) {
				if (value)
					this.options.defender.magenDefenseOmega = false;
			},
			'options.defender.magenDefenseOmega': function (value) {
				if (value)
					this.options.defender.magenDefense = false;
				else
					this.options.defender.hasDock = false;
			},
			'options.attacker.x89Omega': function (value) {
				if (!value)
					this.options.defender.x89Conservative = false;
			},
			'options.attacker.argentStrikeWing': function (value) {
				if (!value)
					this.options.attacker.argentStrikeWingBombardmentA = false;
					this.options.attacker.argentStrikeWingBarrageA = false;
					this.options.attacker.argentStrikeWingSpaceCannonA = false;
			},
			'options.defender.argentStrikeWing': function (value) {
				if (!value)
					this.options.defender.argentStrikeWingBarrageD = false;
					this.options.defender.argentStrikeWingSpaceCannonD = false;
			},
			'options.attacker.nomadCavalry': function (value) {
				if (!value)
					this.options.attacker.hasMemoriaIIA = false;
			},
			'options.defender.nomadCavalry': function (value) {
				if (!value)
					this.options.attacker.hasMemoriaIID = false;
			},
			'options.attacker.directHit': function (value) {
				if (!value)
					this.options.attacker.directHit2A = false;
			},
			'options.attacker.directHit2A': function (value) {
				if (!value)
					this.options.attacker.directHit3A = false;
			},
			'options.attacker.directHit3A': function (value) {
				if (!value)
					this.options.attacker.directHit4A = false;
			},
			'options.defender.directHit': function (value) {
				if (!value)
					this.options.defender.directHit2D = false;
			},
			'options.defender.directHit2D': function (value) {
				if (!value)
					this.options.defender.directHit3D = false;
			},
			'options.defender.directHit3D': function (value) {
				if (!value)
					this.options.defender.directHit4D = false;
			},
			'options.attacker.maneuveringJets': function (value) {
				if (!value)
					this.options.attacker.maneuveringJets2A = false;
			},
			'options.attacker.maneuveringJets2A': function (value) {
				if (!value)
					this.options.attacker.maneuveringJets3A = false;
			},
			'options.attacker.maneuveringJets3A': function (value) {
				if (!value)
					this.options.attacker.maneuveringJets4A = false;
			},
			'options.defender.maneuveringJets': function (value) {
				if (!value)
					this.options.defender.maneuveringJets2D = false;
			},
			'options.defender.maneuveringJets2D': function (value) {
				if (!value)
					this.options.defender.maneuveringJets3D = false;
			},
			'options.defender.maneuveringJets3D': function (value) {
				if (!value)
					this.options.defender.maneuveringJets4D = false;
			},
			battleType: recomputeHandler,
			attackerUnits: updateDamageableCountAndRecomputeHandler('attacker'),
			defenderUnits: updateDamageableCountAndRecomputeHandler('defender'),
			options: recomputeHandler,
			canvasSize: function () {
				persistInput();
				var self = this;
				if (lastComputed)
					this.$nextTick(function () {
						this.displayDistribution(lastComputed);
					});
			},
			forceSlow: recomputeHandler,
		},
		computed: {
			technologies: function() {
				var result = [];
				var techKeys = Object.keys(Technologies);
				for (var i = 0; i < techKeys.length; ++i){
					var tech = Technologies[techKeys[i]];
					if (tech.limitedTo === BattleSide.attacker && (i + 1 < techKeys.length) && Technologies[techKeys[i+1]].limitedTo === BattleSide.defender){
						// special collapsing of Ω techs into one row
						result.push({
							pair: {
							[BattleSide.attacker]: {
								key: techKeys[i],
								option: Technologies[techKeys[i]],
							},
							[BattleSide.defender]: {
								key: techKeys[i + 1],
								option: Technologies[techKeys[i + 1]],
							}
						}});
						i++;
					} else {
						result.push({
							key: techKeys[i],
							option: tech
						});
					}
				}

				return result;
			},
			raceTechnologies: function () {
				var attackerTech = RaceSpecificTechnologies[this.options.attacker.race] || {};
				var defenderTech = RaceSpecificTechnologies[this.options.defender.race] || {};
				var attackerTechKeys = Object.keys(attackerTech);
				var defenderTechKeys = Object.keys(defenderTech);
				var result = [];
				
				for (var i = 0; i < attackerTechKeys.length || i < defenderTechKeys.length; ++i) {
					var pair = {};
					pair.attacker = i < attackerTechKeys.length ? {
						key: attackerTechKeys[i],
						option: attackerTech[attackerTechKeys[i]],
					} : stub(defenderTech[defenderTechKeys[i]].title);
					pair.defender = i < defenderTechKeys.length ? {
						key: defenderTechKeys[i],
						option: defenderTech[defenderTechKeys[i]],
					} : stub(attackerTech[attackerTechKeys[i]].title);
					result.push(pair);
				}
				return result;

				function stub(name) {
					return {
						key: '',
						option:
							{
								title: name,
								availableFor: function () {
									return false;
								}
							}
					};
				}
			},
			heroes: function () {
				var attackerOption = Heroes[this.options.attacker.race] || {};
				var defenderOption = Heroes[this.options.defender.race] || {};
				var attackerOptionKeys = Object.keys(attackerOption);
				var defenderOptionKeys = Object.keys(defenderOption);
				var result = [];
				for (var i = 0; i < attackerOptionKeys.length || i < defenderOptionKeys.length; ++i) {
					var pair = {};
					pair.attacker = i < attackerOptionKeys.length ? {
						key: attackerOptionKeys[i],
						option: attackerOption[attackerOptionKeys[i]],
					} : stub(defenderOption[defenderOptionKeys[i]].title);
					pair.defender = i < defenderOptionKeys.length ? {
						key: defenderOptionKeys[i],
						option: defenderOption[defenderOptionKeys[i]],
					} : stub(attackerOption[attackerOptionKeys[i]].title);
					result.push(pair);
				}
				return result;

				function stub(name) {
					return {
						key: '',
						option:
							{
								title: name,
								availableFor: function () {
									return false;
								}
							}
					};
				}
			},
			raceOptions: function () {
				var attackerOption = RacialSpecific[this.options.attacker.race] || {};
				var defenderOption = RacialSpecific[this.options.defender.race] || {};
				var attackerOptionKeys = Object.keys(attackerOption);
				var defenderOptionKeys = Object.keys(defenderOption);
				var result = [];
				for (var i = 0; i < attackerOptionKeys.length || i < defenderOptionKeys.length; ++i) {
					var pair = {};
					pair.attacker = i < attackerOptionKeys.length ? {
						key: attackerOptionKeys[i],
						option: attackerOption[attackerOptionKeys[i]],
					} : stub(defenderOption[defenderOptionKeys[i]].title);
					pair.defender = i < defenderOptionKeys.length ? {
						key: defenderOptionKeys[i],
						option: defenderOption[defenderOptionKeys[i]],
					} : stub(attackerOption[attackerOptionKeys[i]].title);
					result.push(pair);
				}
				return result;

				function stub(name) {
					return {
						key: '',
						option:
							{
								title: name,
								availableFor: function () {
									return false;
								}
							}
					};
				}
			},
			canvasWidth: function () {
				return window.CanvasSizes[this.canvasSize].width + 'px';
			},
			canvasHeight: function () {
				return window.CanvasSizes[this.canvasSize].height + 'px';
			},
		},
	});
	Vue.component('left-option', {
		props: ['optionName', 'option', 'options', 'side'],
		template:
		'<div class="o-grid__cell left-option" :class="{ hidden: !option.availableFor(side) }">' +
		'	<label class="" v-bind:for="side + \'.\' + optionName"' +
		'			v-bind:title="option.description">{{option.title}}</label>' +
		'	<input type="checkbox" class="" v-bind:id="side + \'.\' + optionName"' +
		'			v-model="options[side][optionName]">' +
		'</div>',
	});
	Vue.component('right-option', {
		props: ['optionName', 'option', 'options', 'side'],
		template:
		'<div class="o-grid__cell right-option" :class="{ hidden: !option.availableFor(side) }">' +
		'	<input type="checkbox" class="" v-bind:id="side + \'.\' + optionName"' +
		'			v-model="options[side][optionName]">' +
		'	<label class="" v-bind:for="side + \'.\' + optionName"' +
		'			v-bind:title="option.description">{{option.title}}</label>' +
		'</div>',
	});
	Vue.component('option-pair', {
		props: ['optionName', 'option', 'options', 'pair', 'visible'],
		template:
		'<div class="o-grid center-grid" v-if="visible !== false">' +
		'	<left-option :option-name="option ? optionName : pair.attacker.key" :option="option || pair.attacker.option" :options="options" side="attacker"></left-option>' +
		'	<help-mark v-if="option" :option="option"></help-mark>' +
		'	<help-mark v-if="pair" :option="pair.attacker.option" :class="{ hidden: !pair.attacker.option.availableFor(\'attacker\') }"></help-mark>' +
		'	<help-mark v-if="pair" :option="pair.defender.option" :class="{ hidden: !pair.defender.option.availableFor(\'defender\') }"></help-mark>' +
		'	<right-option :option-name="option ? optionName : pair.defender.key" :option="option || pair.defender.option" :options="options" side="defender"></right-option>' +
		'</div>',
	});
	Vue.component('help-mark', {
		props: ['option'],
		template:
		'<div class="o-grid__cell">' +
		'	<button type="button" class="help" v-bind:title="option.description" @click="showHelp"></button>' +
		'</div>',
		methods: {
			showHelp: function () {
				alert(this.option.title + ':\n' + this.option.description);
			}
		}
	});

	app.recompute();

	/** When the race changed from the race having an upgrade for the unit (eg Sol Carrier)
	 * to the race not having such upgrade, input flag for the unit upgrade should be set to false */
	function resetUpdatesAndTechnologies(battleSide) {
		return function (newRace, oldRace) {
			for (var unitType in UnitType) {
				var counter = this[SideUnits[battleSide]][unitType];
				if (!upgradeable(newRace, unitType)) {
					counter.upgraded = false;
				}
				if (!damageable(newRace, unitType, counter.upgraded)) {
					counter.damaged = 0;
				}
				/*if (newRace != oldRace) {
					counter.participants = 0;
				}*/
			}
			if (RaceSpecificTechnologies[oldRace]){
				for (var tech in RaceSpecificTechnologies[oldRace]){
					this.options[battleSide][tech] = false;
				}
			}
			if (RacialSpecific[oldRace]){
				for (var option in RacialSpecific[oldRace]){
					this.options[battleSide][option] = false;
				}
			}
			if (Heroes[oldRace]){
				for (var option in Heroes[oldRace]){
					this.options[battleSide][option] = false;
				}
			}
		};
	}

	function updateDamageableCountAndRecomputeHandler(battleSide) {
		return {
			handler: function () {
				for (var unitType in UnitType) {
					var counter = this[SideUnits[battleSide]][unitType];
					counter.damaged = Math.min(counter.damaged, counter.count);
					counter.participants = Math.min(counter.participants,counter.count);
				}
				this.recompute();
			},
			deep: true
		}
	}

	function getInput() {
		return mergeDeep(getDefaultInput(), getPersistedInput());

		function isObject(item) {
			return (item && typeof item === 'object' && !Array.isArray(item));
		}

		function mergeDeep(target, ...sources) {
			if (!sources.length) return target;
			const source = sources.shift();

			if (isObject(target) && isObject(source)) {
				for (const key in source) {
					if (isObject(source[key])) {
						if (!target[key]) Object.assign(target, { [key]: {} });
						mergeDeep(target[key], source[key]);
					} else {
						Object.assign(target, { [key]: source[key] });
					}
				}
			}

			return mergeDeep(target, ...sources);
		}
	}

	function getDefaultInput() {
		var result = {
			battleType: BattleType.Space,
			attackerUnits: {},
			defenderUnits: {},
			options: {
				attacker: {
					race: Race.Arborec,
				}, defender: null,
			},
			canvasSize: 0,
		};

		for (var technology in Technologies) {
			result.options.attacker[technology] = false;
		}
		for (var actionCard in ActionCards) {
			result.options.attacker[actionCard] = false;
		}
		for (var agenda in Agendas) {
			result.options.attacker[agenda] = false;
		}
		for (var promissory in Promissory) {
			result.options.attacker[promissory] = false;
		}
		result.options.attacker.riskDirectHit = true;

		result.options.defender = Object.assign({}, result.options.attacker);

		for (var unitType in UnitType) {
			result.attackerUnits[unitType] = { count: 0, upgraded: false, damaged: 0, participants: 0 };
			result.defenderUnits[unitType] = { count: 0, upgraded: false, damaged: 0, participants: 0 };
		}
		return result;
	}

	function persistInput() {
		if (localStorage) {
			var inputToSave = JSON.parse(JSON.stringify(input));
			for (var viewOnlyProperty in transientProperties) {
				delete inputToSave[viewOnlyProperty];
			}
			localStorage.setItem('ti4calc/input', JSON.stringify(inputToSave));
			return true;
		}
		return false;
	}

	function getPersistedInput() {
		if (!localStorage) return null;
		var resultString = localStorage.getItem('ti4calc/input');
		if (!resultString) return null;
		var result = JSON.parse(resultString);
		for (var unitType in UnitType) {
			// because previous published version didn't have already damaged units, persisted input might miss these fields
			//console.log(result.attackerUnits[unitType]);
			
			result.attackerUnits[unitType].damaged = result.attackerUnits[unitType].damaged || 0;
			result.defenderUnits[unitType].damaged = result.defenderUnits[unitType].damaged || 0;
		}
		return result;
	}
})();