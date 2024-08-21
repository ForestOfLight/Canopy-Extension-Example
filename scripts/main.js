import { Command, Rule } from 'lib/canopy/CanopyExtension';
import extension from 'config';
import { world } from '@minecraft/server';

/**
 * Adding a new Rule:
 */
extension.addRule(new Rule({
    identifier: 'ruleExample', // The name of the rule
    description: 'An example rule', // Shows up in the help command
    // Optional:
    contingentRules: [], // Rules that will be set to true when this rule is set to true
    independentRules: [] // Rules that will be set to false when this rule is set to true
}));

// use the rule to control your code flow
world.afterEvents.buttonPush.subscribe((event) => {
    if (!Rule.getValue('ruleExample')) return;
    if (!event.source) return; // Always check for undefined entities and players. Simulated players always show up as undefined in events.
    entity.sendMessage('§aYou pushed a button!');
})

/**
 * Making a second new Rule:
 */
extension.addRule(Rule({
    identifier: 'commandExample',
    description: `Enables the ${Command.getPrefix()}example command`,
}));

/**
 * Adding a new Command:
 */
extension.addCommand(new Command({
    identifier: 'example', // The name of the command
    description: 'An example command', // Shows up in the help command
    usage: 'example [message]', // The usage of the command that shows up in the help command & when used incorrectly
    callback: exampleCommand, // The function to run when the command is executed
    // Optional:
    args: [
        { type: 'string|number', name: 'message' } // The arguments that the command takes. 'string|number' means it can be either a string or a number
    ],
    contingentRules: ['commandExample'], // Rules that must be true for the command to be enabled
    adminOnly: false, // Whether the command can only be run by admins (users with the 'CanopyAdmin' tag)
    helpEntries: [], // Additional help entries that show up in the help command
    helpHidden: false // Whether the command should be hidden from the help command.
}));

/**
 * Adding a command alias:
 */
extension.addCommand(new Command({
    identifier: 'ex',
    description: 'An alias for the example command',
    usage: 'ex [message]',
    callback: exampleCommand,
    args: [
        { type: 'string', name: 'message' }
    ],
    contingentRules: ['commandExample'],
    helpHidden: true, // notice this difference
}))

// now you can define the function that will be called when the command is executed
function exampleCommand(sender, args) {
    let { message } = args;
    if (!isNaN(parseFloat(value)) && isFinite(value))
        message = message.toString();
    sender.sendMessage(`§aYou ran the example command with the message: §7${message}`);
}
