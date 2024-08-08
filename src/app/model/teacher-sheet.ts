import { BaseInfo } from "./common-info";

export enum TeacherSheetName {
    '출석 기록' = '출석 기록',
    '혜화랩 교과' = '혜화랩 교과' ,
    '체육' = '체육',
    '역사' = '역사',
    '코딩랩' = '코딩랩',
    '디자인랩' ='디자인랩',
    '메이킹랩' = '메이킹랩',
    '마케팅랩' = '마케팅랩',
    '주제중심' = '주제중심',
    '개인주제' = '개인주제',
    '문제정의 1분기' = '문제정의 1분기', 
    '문제정의 2분기' = '문제정의 2분기'
}

export interface AttendanceSheet extends BaseInfo{
    '전체수업일수': number,
    '결석': number,
    '지각': number,
    '조퇴': number,
    '공결': number,
    '병결': number,
    '병지각': number,
    '병조퇴': number,
    moduleIndex: number
}

export interface RabSheet extends BaseInfo{
    '지식1': number,
    '역량1': number,
    '역량2': number,
    '역량3': number,
    '역량4': number,
    '역량5': number,
    '교과 수업 개요': string,
    '교과 교사 측정': string,
    '이수여부': string,
    moduleIndex: number
}

export interface GymSheet extends BaseInfo{
    '체육 수업 개요': string,
    '이수여부': string,
    moduleIndex: number
}

export interface SubjectSheet extends BaseInfo{
    '지식1': number,
    '지식2': number,
    '역량1': number,
    '역량2': number,
    '역량3': number,
    '역량4': number,
    '역량5': number,
    '태도1': number,
    '태도2': number,
    '교사 총평': string,
    '이수여부': string,
    moduleIndex: number
}

export interface PersonalSheet extends BaseInfo{
    '지식1': number,
    '역량1': number,
    '역량2': number,
    '역량3': number,
    '역량4': number,
    '역량5': number,
    '태도1': number,
    '태도2': number,
    '개인주제 교사 측정': string,
    '이수여부': string,
    moduleIndex: number
}

export interface ProblemSheet extends BaseInfo{
    '지식1': number,
    '역량1': number,
    '역량2': number,
    '역량3': number,
    '역량4': number,
    '역량5': number,
    '태도1': number,
    '태도2': number,
    '교사 측정': string,
    '이수여부': string,
    moduleIndex: number
}


