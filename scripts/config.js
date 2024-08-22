import { CanopyExtension } from 'lib/canopy/CanopyExtension';

/**
 * Create a new CanopyExtension instance to define your extension.
 */
const extension = new CanopyExtension({
    name: 'Your Extension Name',
    description: 'A new extension for §l§aCanopy§r!', // This is shown in the help command
    version: '1.0.0',
});

export default extension;