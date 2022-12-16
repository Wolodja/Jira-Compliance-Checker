import Resolver from '@forge/resolver';
import api, {route} from '@forge/api';

const resolver = new Resolver();
const requiredSummary = 50;
const requiredDescription = 4;

function getScore(data) {
    const summary = data.fields.summary;
    let summaryScore = summary ? summary.length / requiredSummary : 0;
    if (summaryScore > 1) {
        summaryScore = 1;
    }
    const description = data.fields.description;
    let descriptionScore = description ? description.content.length / requiredDescription : 0;
    if (descriptionScore > 1) {
        descriptionScore = 1;
    }
    return (summaryScore + descriptionScore) / 2 * 100;
}

resolver.define('getText', async (req) => {
    console.log(req);
    console.log(`Issue key ${req.context.extension.issue.key}`);
    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${req.context.extension.issue.key}`)
    const data = await response.json();
    return getScore(data);
});

resolver.define('getProjectOverview', async (req) => {
    console.log(req);
    return "Project overview";
});

export const handler = resolver.getDefinitions();
