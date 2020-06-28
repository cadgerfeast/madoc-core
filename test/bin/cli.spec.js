import inquirer from 'inquirer';
import { main } from '../../bin/cli';

describe('cli.js', () => {
  it('should call inquirer if init', async () => {
    inquirer.prompt = jest.fn().mockResolvedValue({ todo: 'dummy' });
    await main({ 
      _: ['init']
    });
    expect(inquirer.prompt).toHaveBeenCalled();
  });
});
