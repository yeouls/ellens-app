import { NzUploadFile } from "ng-zorro-antd/upload";

export class BaseInfo {
    '입학 구분': string = '';
    '이름': string = '';
    '닉네임': string = '';
    '코칭 교사': string = '';
    '작성교사'?: string = '';
}

export class MainInfo extends BaseInfo {
    '오전교육과정': string = '';
    '오후교육과정': string = '';
    '국어이수': string = '';
    '영어이수': string = '';
    '수학이수': string = '';
    '사회이수': string = '';
    '역사이수': string = '';
    '과학이수': string = '';
    '주제이수': string = '';
    '마케팅랩이수': string = '';
    '코딩랩이수': string = '';
    '문제정의이수': string = '';
    '체육이수': string = '';
    '개인주제이수': string = '';
    '수업일수': string = '';
    '결석': string = '';
    '지각': string = '';
    '조퇴': string = '';
    '공결': string = '';
    '병결': string = '';
    '병지각': string = '';
    '병조퇴': string = '';
    '수선개요': string = '';
    '수선학생': string = '';
    '수선교사': string = '';
    '예티개요': string = '';
    '예티학생': string = '';
    '예티교사': string = '';
    '히치개요': string = '';
    '히치학생': string = '';
    '히치교사': string = '';
    '몰라개요': string = '';
    '몰라학생': string = '';
    '몰라교사': string = '';
    '단테개요': string = '';
    '단테학생': string = '';
    '단테교사': string = '';
    '도령개요': string = '';
    '도령학생': string = '';
    '도령교사': string = '';
    '은열개요': string = '';
    '은열학생': string = '';
    '은열교사': string = '';
    '라라개요': string = '';
    '라라학생': string = '';
    '라라교사': string = '';
    '주제개요': string = '';
    '주제학생': string = '';
    '주제교사': string = '';
    '마케팅랩개요': string = '';
    '마케팅랩학생': string = '';
    '마케팅랩교사': string = '';
    '코딩랩개요': string = '';
    '코딩랩학생': string = '';
    '코딩랩교사': string = '';
    '체육개요': string = '';
    '체육학생': string = '';
    '체육교사': string = '';
    '개인개요': string = '';
    '개인학생': string = '';
    '개인교사': string = '';
    '문제개요': string = '';
    '문제학생': string = '';
    '문제교사': string = '';
}

export interface infoSheet extends BaseInfo {
    '오전': string;
    '오후': string;
}


export interface IUploadList {
    mainFileList: NzUploadFile[];
    teacherFileList: NzUploadFile[];
    studentFileList: NzUploadFile[];
}