import chai from 'chai';
import promised from 'chai-as-promised';
import sinionChai from 'sinon-chai';

chai.use(promised);
chai.use(sinionChai);

global.expect = chai.expect;
