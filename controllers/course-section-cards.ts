import GqlApi from "../lib/gql-api";
import * as showdown from 'showdown';
import * as cheerio from 'cheerio';
import {toUrlId} from "../utils/url-ids";

const mdToHTML = new showdown.Converter()
mdToHTML.setFlavor('github')

export async function getCourseSectionCard(client: GqlApi, locale: string, courseId: string, unitId: string, unitUrlId: string, sectionId: string, sectionUrlId: string, cardId?: string) {
    const card = await client.getSectionCard(courseId, unitId, sectionId, cardId);
    const course = await client.getCourseByID(courseId);
    const title = `${course.title} - ${card.title}`;
    const $ = cheerio.load(mdToHTML.makeHtml(card.content.content));
    $('iframe').each(function () {
        $(this).replaceWith(`
            <amp-iframe width="200"
                height="100"
                sandbox="allow-scripts allow-same-origin"
                layout="responsive"
                frameborder="0"
                src="${$(this).attr('src')}">
            </amp-iframe>
        `)
    });
    console.log();
    return {
        view: 'course_section_card',
        data: {
            meta_title: title,
            title: title,
            canon_link: `/learn-${locale}/courses/${toUrlId(course.title, course.id)}/units/${unitUrlId}/sections/${sectionUrlId}/card/${toUrlId(card.title, card.id)}`,
            img_url: course.logo_url,
            card_content: $.html()
        }
    }
}
