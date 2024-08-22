import { CanopyExtension, Command, Rule } from 'lib/canopy/CanopyExtension';
import { world } from '@minecraft/server';

/**
 * Create a new CanopyExtension instance to define your extension.
 */
const extension = new CanopyExtension({
    name: 'ExampleExtension',
    description: 'Example extension for §l§aCanopy§r!',
    version: '1.0.0',
});

// --------------------------------------------

/**
 * Adding a new Rule:
 */
const exampleRule = new Rule({
    identifier: 'exampleRule', // The name of the rule
    description: 'An example rule that prints a message in chat when you hit a button.', // Shows up in the help command
    // Optional:
    contingentRules: [], // Rules that will be set to true when this rule is set to true
    independentRules: [] // Rules that will be set to false when this rule is set to true
});
extension.addRule(exampleRule);

// use the rule to control your code flow
world.afterEvents.buttonPush.subscribe((event) => {
    if (!exampleRule.getValue()) 
        return;
    if (event.source === undefined) // Always check for undefined entities and players. Simulated players always show up as undefined in events.
        return;
    event.source.sendMessage('§aYou pushed a button!');
});

// --------------------------------------------

/**
 * Making a second new rule which we can use to enable the example command:
 * (This is not required to make a new command, but it is helpful to allow admins to disable your commands.)
 */
const commandExampleRule = new Rule({
    identifier: 'commandExample',
    description: `Enables the example command.`,
});
extension.addRule(commandExampleRule);

/**
 * Adding a new Command:
 */
const exampleCommand = new Command({
    name: 'example', // The name of the command
    description: 'An example command that prints your message in chat.', // Shows up in the help command
    usage: 'example [message]', // The usage of the command that shows up in the help command & when used incorrectly
    callback: exampleCommandCallback, // The function to run when the command is executed
    // Optional:
    args: [
        { type: 'string|number', name: 'message' } // The arguments that the command takes. 'string|number' means it can be either a string or a number
    ],
    contingentRules: ['commandExample'], // Rules that must be true for the command to be enabled
    adminOnly: false, // Whether the command can only be run by admins (users with the 'CanopyAdmin' tag)
    helpEntries: [ // Additional help entries that show up in the help command
        { usage: `example`, description: `Run the example command with the default message.` },
    ],
    helpHidden: false // Whether the command should be hidden from the help command.
});
extension.addCommand(exampleCommand);

/**
 * Adding a command alias:
 */
const exampleCommandAlias = new Command({
    name: 'ex',
    description: 'An alias for the example command.',
    usage: 'ex [message]',
    callback: exampleCommandCallback,
    args: [
        { type: 'string|number', name: 'message' }
    ],
    contingentRules: ['commandExample'],
    helpHidden: true, // notice this difference
});
extension.addCommand(exampleCommandAlias);

// now you can define the function that will be called when the command is executed
function exampleCommandCallback(sender, args) {
    let { message } = args;
    if (message === null) 
        message = 'Hello, world!';
    if (!isNaN(parseFloat(message)) && isFinite(message))
        message = message.toString();
    sender.sendMessage(`§aYou ran the example command with the message: §7${message}`);
}
