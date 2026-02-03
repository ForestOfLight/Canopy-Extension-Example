import { BlockCommandOrigin, BooleanRule, CanopyExtension, Command, EntityCommandOrigin, IntegerRule, PlayerCommandOrigin, ServerCommandOrigin } from './lib/canopy/CanopyExtension';
import { world, CustomCommandParamType, CommandPermissionLevel } from '@minecraft/server';

/**
 * Create a new CanopyExtension instance to define your extension.
 * Your extension must be exported from main.js.
 */
export const extension = new CanopyExtension({
    author: 'YourName',
    name: 'ExampleExtension',
    description: 'Example extension for §l§aCanopy§r!',
    version: '1.0.0'
});

// --------------------------------------------

/**
 * Adding a new Rule:
 */
const exampleRule = new BooleanRule({
    identifier: 'exampleRule', // The name of the rule
    description: 'An example rule that prints a message in chat when you hit a button.', // Shows up in the help command. Can be String or RawText type.
    // Optional:
    defaultValue: true, // The default value if the rule is uninitialized.
    contingentRules: [], // Rules that will be set to true when this rule is set to true.
    independentRules: [], // Rules that will be set to false when this rule is set to true.
    // Optional for BooleanRule:
    onEnableCallback: () => {}, // A function to run when the rule is set to true.
    onDisableCallback: () => {} // A function to run when the rule is set to false.
});
extension.addRule(exampleRule);

// Use the rule to control your code flow.
world.afterEvents.buttonPush.subscribe((event) => {
    if (!exampleRule.getValue()) 
        return;
    if (event.source === undefined) // Always check for undefined entities and players. Simulated players always show up as undefined in events.
        return;
    event.source.sendMessage('§aYou pushed a button!');
});

const exampleIntegerRule = new IntegerRule({
    identifier: 'exampleIntegerRule',
    description: 'An example rule that prints a message in chat when you modify its value.',
    // Mandatory for IntegerRule and FloatRule:
    valueRange: { range: { min: 0.0, max: 10.0 }, other: [-1.0] }, // All values must be floats. The rule will accept values within the range or that match any value in the "other" category.
    // Optional for IntegerRule and FloatRule:
    onModifyCallback: (value) => { world.sendMessage(`§aYou modified the example integer rule to ${value}!`) } // A function to run when the rule is modified.
});
extension.addRule(exampleIntegerRule);

// --------------------------------------------

/**
 * Making a second new rule which we can use to enable the example command:
 * (This is not required to make a new command, but it is helpful to allow admins to disable your commands.)
 */
const commandExampleRule = new BooleanRule({
    identifier: 'commandExample',
    description: { text: 'Enables the example command.' } // Shows up in the help command. RawMessage type.
});
extension.addRule(commandExampleRule);

/**
 * Adding a new Command:
 */
new Command({
    // Takes the same parameters as the Mojang CustomCommand Interface:
    // https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/customcommand?view=minecraft-bedrock-experimental
    // However, a few extras features are added and cheatsRequired defaults to false instead of true.
    name: 'namespace:example',
    description: 'An example command that prints your message in chat.',
    permissionLevel: CommandPermissionLevel.Any,
    callback: exampleCommandCallback, // The function to run when the command is executed. 
        // The first argument is the origin and the rest are the command arguments.
        // The origin command argument allows using getSource() to get the source entity and sendMessage() directly.
    // Optional:
    optionalParameters: [
        { name: 'message', type: CustomCommandParamType.String }
    ],
    contingentRules: ['commandExample'], // Rules that must be true for the command to be enabled.
    allowedSources: [PlayerCommandOrigin, BlockCommandOrigin, EntityCommandOrigin, ServerCommandOrigin] // Which types of command origins can run this command.
});

// Now you can define the function that will be called when the command is executed.
function exampleCommandCallback(sender, message) {
    if (message === undefined)
        message = 'Hello, world!';
    sender.sendMessage(`§aYou ran the example command with the message: §7${message}`);
}
