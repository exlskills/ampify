import GqlApi from "../lib/gql-api";
import * as showdown from 'showdown';

const mdToHTML = new showdown.Converter()
mdToHTML.setFlavor('github')

export async function getCourseSectionCard(client: GqlApi, locale: string, courseId: string, unitId: string, sectionId: string, cardId?: string) {
    const card = await client.getSectionCard(courseId, unitId, sectionId, cardId);
    const content = await client.getVersionedContent(card.content.id, card.content.version);
    const course = await client.getCourseByID(courseId);
    const title = `${course.title} - ${card.title}`;
    return {
        view: 'course_section_card',
        data: {
            meta_title: title,
            title: title,
            img_url: course.logo_url,
            card_content: mdToHTML.makeHtml(content.content)
        }
    }
}