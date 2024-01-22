import { LocalProvider } from "../../../src/utils/strategies/localStrategy";

class TestLocalProvider extends LocalProvider {
  testGetUserByEmail = this.getUserByEmail;
  testCreateDefaultUserOBJ = this.createDefaultUserOBJ;
}

export const testLocalProvider = new TestLocalProvider();
