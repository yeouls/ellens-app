import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DefaultData {
    studentResponseOrder: string[] = ['혜화', '알파', '개인', '문제', '문화'];
    teacherFileOrder: string[] = ['도령', '몰라', '수선', '예티', '히치', '단테', '열음', '볼더'];
    keyColumns: string[] = [
        'NO',
        '입학 구분',
        '이름',
        '닉네임',
        '마케팅랩이수',
        '디자인랩이수',
        '코딩랩이수',
        '메이킹랩이수',
        '마케팅랩개요',
        '마케팅랩학생',
        '마케팅랩교사',
        '코딩랩개요',
        '코딩랩학생',
        '코딩랩교사',
        '디자인랩개요',
        '디자인랩학생',
        '디자인랩교사',
        '메이킹랩개요',
        '메이킹랩학생',
        '메이킹랩교사',
        '학생회',
        '학생회활동',
        '학생회느낀점',
        '동아리1',
        '동아리활동1',
        '동아리느낀점1',
        '동아리2',
        '동아리활동2',
        '동아리느낀점2',
        '동아리3',
        '동아리활동3',
        '동아리느낀점3',
    ];
    columns: string[] = [
        '코칭 교사',
        '오전교육과정',
        '오후교육과정',
        '국어이수',
        '영어이수',
        '수학이수',
        '사회이수',
        '역사이수',
        '과학이수',
        '주제이수',
        '1문제정의이수',
        '2문제정의이수',
        '체육이수',
        '개인주제이수',
        '수업일수',
        '결석',
        '지각',
        '조퇴',
        '공결',
        '병결',
        '병지각',
        '병조퇴',
        '국어개요',
        '국어학생',
        '국어교사',
        '영어개요',
        '영어학생',
        '영어교사',
        '수학개요',
        '수학학생',
        '수학교사',
        '사회개요',
        '사회학생',
        '사회교사',
        '역사개요',
        '과학개요',
        '과학학생',
        '과학교사',
        '주제개요',
        '주제학생',
        '주제교사',
        '체육개요',
        '체육학생',
        '체육교사',
        '개인개요',
        '개인학생',
        '개인교사',
        '문제개요',
        '문제학생',
        '1문제교사', 
        '2문제교사'
    ];
    exportData: string[] = [
        '입학 구분',
        '이름',
        '닉네임',
        '코칭 교사',
        // '2#코칭 교사',
        '수업일수',
        '결석',
        '지각',
        '조퇴',
        '공결',
        '병결',
        '병지각',
        '병조퇴',
        // '2#수업일수',
        // '2#결석',
        // '2#지각',
        // '2#조퇴',
        // '2#공결',
        // '2#병결',
        // '2#병지각',
        // '2#병조퇴',
        '오전교육과정',
        '국어이수',
        '영어이수',
        '수학이수',
        '사회이수',
        '역사이수',
        '과학이수',
        '주제이수',
        '마케팅랩이수',
        '디자인랩이수',
        '메이킹랩이수',
        '코딩랩이수',
        // '오전교육과정',
        // '2#국어이수',
        // '2#영어이수',
        // '2#수학이수',
        // '2#사회이수',
        // '2#역사이수',
        // '2#과학이수',
        // '2#주제이수',
        // '2#랩1이수',
        // '2#랩2이수',
        '오후교육과정',
        '체육이수',
        '개인주제이수',
        '1문제정의이수',
        '2문제정의이수',
        // '2#오후교육과정',
        // '2#체육이수',
        // '2#개인주제이수',
        // '2#문제정의이수',
        '학생회',
        '동아리1',
        '동아리2',
        '동아리3',
        '학생회활동',
        '학생회느낀점',
        '동아리활동1',
        '동아리활동2',
        '동아리활동3',
        '동아리느낀점1',
        '동아리느낀점2',
        '동아리느낀점3',
        '국어개요',
        '국어학생',
        '국어교사',
        '국어개요',
        '국어학생',
        '국어교사',
        '영어개요',
        '영어학생',
        '영어교사',
        '수학개요',
        '수학학생',
        '수학교사',
        '사회개요',
        '사회학생',
        '사회교사',
        '과학개요',
        '과학학생',
        '과학교사',
        '역사개요',
        '주제개요',
        '주제학생',
        '주제교사',
        // '2#국어개요',
        // '2#국어학생',
        // '2#국어교사',
        // '2#국어개요',
        // '2#국어학생',
        // '2#국어교사',
        // '2#영어개요',
        // '2#영어학생',
        // '2#영어교사',
        // '2#수학개요',
        // '2#수학학생',
        // '2#수학교사',
        // '2#사회개요',
        // '2#사회학생',
        // '2#사회교사',
        // '2#과학개요',
        // '2#과학학생',
        // '2#과학교사',
        // '2#역사개요',
        // '2#역사학생',
        // '2#역사교사',
        // '2#주제개요',
        // '2#주제학생',
        // '2#주제교사',
        '마케팅랩개요',
        '마케팅랩학생',
        '마케팅랩교사',
        '디자인랩개요',
        '디자인랩학생',
        '디자인랩교사',
        '메이킹랩개요',
        '메이킹랩학생',
        '메이킹랩교사',
        '코딩랩개요',
        '코딩랩학생',
        '코딩랩교사',
        // '2#랩1개요',
        // '2#랩1학생',
        // '2#랩1교사',
        // '2#랩2개요',
        // '2#랩2학생',
        // '2#랩2교사',
        '개인개요',
        '개인학생',
        '개인교사',
        // '2#개인개요',
        // '2#개인학생',
        // '2#개인교사',
        '문제개요',
        '문제학생',
        '1문제교사',
        '2문제교사',
        // '2#문제개요',
        // '2#문제학생',
        // '2#문제교사',
        '체육개요',
        // '2#체육개요',
    ]
}