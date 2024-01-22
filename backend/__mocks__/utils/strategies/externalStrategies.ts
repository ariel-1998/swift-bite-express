import { ExternalAuthProvider } from "../../../src/utils/strategies/externalStrategies";

class TestExternalAuthProvider extends ExternalAuthProvider {
  testQueryProviderData = this.queryProviderData;
  testGetUserByAuthProviderId = this.getUserByAuthProviderId;
  testCreateDefaultProviderOBJ = this.createDefaultProviderOBJ;
  testAddProviderDataToDB = this.addProviderDataToDB;
  testCreateDefaultUserOBJ = this.createDefaultUserOBJ;
  testAddUserDataToDB = this.addUserDataToDB;
  testGenerateAuthProviderIdForDB = this.generateAuthProviderIdForDB;
}

export const testExternalAuthProvider = new TestExternalAuthProvider();
