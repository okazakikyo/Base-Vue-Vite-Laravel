export type InterviewRoleId = "fe" | "be" | "devops" | "qa";

export interface InterviewQuizConfig {
    choices: string[];
    correctIndex: number;
    explanation: string;
}

export interface InterviewQuestionItem {
    id: string;
    question: string;
    answer: string;
    level: string;
    focus: string;
    tags: string[];
    sourceType?: "local" | "github";
    sourceLabel?: string;
    sourceUrl?: string;
}

export interface InterviewQuizQuestionItem extends InterviewQuestionItem {
    quiz: InterviewQuizConfig;
}

export interface InterviewRoleGroup {
    id: InterviewRoleId;
    label: string;
    summary: string;
    description: string;
    questions: InterviewQuizQuestionItem[];
}

export const interviewRoleGroups: InterviewRoleGroup[] = [
    {
        id: "fe",
        label: "Frontend",
        summary: "Vue, browser rendering, state va performance cho UI.",
        description:
            "Phu hop de luyen interview Frontend voi trong tam la HTML/CSS/JavaScript, Vue 3, reactivity va toi uu trai nghiem nguoi dung.",
        questions: [
            {
                id: "fe-1",
                question: "Virtual DOM la gi va Vue dung no de toi uu render nhu the nao?",
                answer:
                    "Virtual DOM la mot cay object mo ta UI trong bo nho. Khi state thay doi, Vue tao virtual tree moi, diff voi tree cu va chi patch nhung node thay doi len DOM that. Cach nay giam thao tac DOM truc tiep va giup render hieu qua hon.",
                level: "Co ban",
                focus: "Rendering",
                tags: ["Vue", "DOM", "Performance"],
                quiz: {
                    choices: [
                        "La DOM that duoc clone lai de backup truoc khi render",
                        "La representation trong bo nho cua UI de diff va patch DOM that",
                        "La ky thuat chi dung cho SSR",
                        "La mot plugin de them animation vao Vue",
                    ],
                    correctIndex: 1,
                    explanation:
                        "Virtual DOM khong phai DOM that. No la representation trong bo nho, giup framework diff thay doi va cap nhat DOM that mot cach toi uu.",
                },
            },
            {
                id: "fe-2",
                question: "Khi nao nen dung computed thay vi watch trong Vue 3?",
                answer:
                    "Dung computed khi can tao gia tri dan xuat tu state va muon no duoc cache theo dependency. Dung watch khi can side effect, vi du goi API, luu localStorage, hoac dong bo voi ben ngoai component.",
                level: "Co ban",
                focus: "Vue Reactivity",
                tags: ["Vue", "computed", "watch"],
                quiz: {
                    choices: [
                        "Computed chi dung cho asynchronous task",
                        "Watch luon tot hon computed vi linh hoat hon",
                        "Computed cho gia tri dan xuat, watch cho side effect",
                        "Computed va watch hoan toan giong nhau",
                    ],
                    correctIndex: 2,
                    explanation:
                        "Computed sinh ra gia tri dan xuat va cache theo dependency, con watch phu hop cho side effect.",
                },
            },
            {
                id: "fe-3",
                question: "Neu mot page Vue bi cham, ban se debug performance theo thu tu nao?",
                answer:
                    "Thuong minh se xac dinh bottleneck truoc: network, bundle, render, re-render hay DOM size. Sau do dung Vue DevTools/Performance tab de xem component nao render nhieu, kiem tra computed/watch, list lon, image nang, code split va cache API.",
                level: "Trung binh",
                focus: "Debug",
                tags: ["Performance", "Profiling", "Bundle"],
                quiz: {
                    choices: [
                        "Tang timeout API truoc",
                        "Chi doi sang dung Tailwind",
                        "Xac dinh bottleneck bang devtools roi moi toi uu dung diem",
                        "Tat het animation la du",
                    ],
                    correctIndex: 2,
                    explanation:
                        "Performance can do va profiling truoc. Khong nen toi uu mu mo khi chua biet diem nghen.",
                },
            },
            {
                id: "fe-4",
                question: "Tai sao can tranh dung index lam key trong v-for?",
                answer:
                    "Vi index khong on dinh khi list reorder, insert hoac remove. Vue co the tai su dung sai DOM node, dan den state UI bi lech, input mat focus hoac du lieu hien thi sai item.",
                level: "Co ban",
                focus: "List rendering",
                tags: ["Vue", "v-for", "key"],
                quiz: {
                    choices: [
                        "Vi index khong phai number",
                        "Vi index lam list render nhanh hon nen bi loi",
                        "Vi index khong on dinh khi list thay doi va co the gay map DOM sai",
                        "Vi Vue khong ho tro key dang so",
                    ],
                    correctIndex: 2,
                    explanation:
                        "Key can on dinh va gan voi identity cua item. Index chi phu hop khi list that su static.",
                },
            },
        ],
    },
    {
        id: "be",
        label: "Backend",
        summary: "API design, database va xu ly logic server-side.",
        description:
            "Danh cho backend interview voi cac chu de quen thuoc nhu REST API, transaction, auth va toi uu truy van.",
        questions: [
            {
                id: "be-1",
                question: "Khi nao nen dung database transaction?",
                answer:
                    "Nen dung transaction khi nhieu thao tac ghi du lieu phai thanh cong hoac that bai cung nhau, vi du tao order, tao order items va tru kho. Neu mot buoc loi, rollback de giu tinh nhat quan du lieu.",
                level: "Co ban",
                focus: "Database",
                tags: ["Transaction", "Consistency", "SQL"],
                quiz: {
                    choices: [
                        "Chi dung cho SELECT query",
                        "Dung khi can dam bao nhieu thao tac ghi du lieu la atomic",
                        "Dung de giam kich thuoc response JSON",
                        "Dung de thay the queue",
                    ],
                    correctIndex: 1,
                    explanation:
                        "Transaction giai quyet tinh atomic va consistency cho nhieu thao tac lien quan den du lieu.",
                },
            },
            {
                id: "be-2",
                question: "Phan biet authentication va authorization.",
                answer:
                    "Authentication tra loi ban la ai, vi du login bang token/session. Authorization tra loi ban duoc lam gi, vi du user co quyen admin hay chi duoc xem resource cua minh.",
                level: "Co ban",
                focus: "Security",
                tags: ["Auth", "Permission", "Security"],
                quiz: {
                    choices: [
                        "Authentication la phan quyen, authorization la dang nhap",
                        "Authentication xac minh danh tinh, authorization kiem soat quyen han",
                        "Hai khái niệm giong nhau",
                        "Authorization chi dung cho microservice",
                    ],
                    correctIndex: 1,
                    explanation:
                        "Authentication xac dinh user la ai, authorization xac dinh user duoc phep lam gi.",
                },
            },
            {
                id: "be-3",
                question: "REST API nen tra ve status code nao khi tao resource thanh cong?",
                answer:
                    "Thong thuong la 201 Created, kem theo body hoac Location header de client biet resource moi vua tao. 200 co the van dung trong mot so truong hop, nhung 201 ro nghia hon cho create.",
                level: "Co ban",
                focus: "API Design",
                tags: ["REST", "HTTP", "Status code"],
                quiz: {
                    choices: ["200 OK", "201 Created", "204 No Content", "409 Conflict"],
                    correctIndex: 1,
                    explanation:
                        "201 la status code chuan nhat cho hanh dong tao resource thanh cong trong REST.",
                },
            },
            {
                id: "be-4",
                question: "N+1 query la gi va cach phong tranh?",
                answer:
                    "N+1 xay ra khi query danh sach cha, sau do moi item lai query them du lieu con, dan den rat nhieu truy van. Cach tranh la eager loading/join, batch query va xem lai cach truy cap relation trong code.",
                level: "Trung binh",
                focus: "ORM",
                tags: ["ORM", "Database", "Performance"],
                quiz: {
                    choices: [
                        "La loi khi co hon 1 database",
                        "La hien tuong lap nhieu query phat sinh theo tung item",
                        "La ten cua mot middleware auth",
                        "La query co hon N cot",
                    ],
                    correctIndex: 1,
                    explanation:
                        "N+1 la van de performance rat pho bien trong ORM khi relation bi load tung item mot.",
                },
            },
        ],
    },
    {
        id: "devops",
        label: "DevOps",
        summary: "CI/CD, container, monitoring va van hanh he thong.",
        description:
            "Tap trung vao kha nang van hanh, deploy va giu he thong on dinh trong moi truong production.",
        questions: [
            {
                id: "devops-1",
                question: "CI va CD khac nhau nhu the nao?",
                answer:
                    "CI la Continuous Integration, tu dong build/test khi code thay doi. CD co the la Continuous Delivery hoac Continuous Deployment, muc tieu la dua build da qua kiem tra den moi truong staging/production mot cach on dinh, co the tu dong hoac ban tu dong.",
                level: "Co ban",
                focus: "CI/CD",
                tags: ["Pipeline", "Automation", "Deployment"],
                quiz: {
                    choices: [
                        "CI la deploy, CD la viet code",
                        "CI tap trung vao integration/build/test, CD tap trung vao delivery/deployment",
                        "CI chi dung cho frontend",
                        "CD chi dung cho Docker",
                    ],
                    correctIndex: 1,
                    explanation:
                        "CI va CD la hai buoc lien tiep nhau trong pipeline, nhung khong dong nghia.",
                },
            },
            {
                id: "devops-2",
                question: "Tai sao can health check trong Kubernetes hoac dockerized service?",
                answer:
                    "Health check giup orchestration biet container con song hay san sang phuc vu request. Nhờ do he thong co the restart instance loi, stop route traffic vao service chua san sang va tang do tin cay khi deploy.",
                level: "Co ban",
                focus: "Containers",
                tags: ["Kubernetes", "Docker", "Reliability"],
                quiz: {
                    choices: [
                        "De tang kich thuoc image",
                        "De service tra HTML dep hon",
                        "De he thong biet service song/san sang va xu ly traffic dung cach",
                        "De thay cho log collection",
                    ],
                    correctIndex: 2,
                    explanation:
                        "Liveness/readiness probe la co che quan trong de van hanh service container an toan.",
                },
            },
            {
                id: "devops-3",
                question: "Blue-green deployment hoac canary deployment dung de giai quyet van de gi?",
                answer:
                    "Chung giup giam rui ro deploy bang cach dua version moi ra tu tu, kiem soat traffic, de rollback nhanh neu co loi, va giam downtime so voi viec deploy de len toan bo he thong mot luc.",
                level: "Trung binh",
                focus: "Release strategy",
                tags: ["Deployment", "Rollback", "Traffic"],
                quiz: {
                    choices: [
                        "Chi de tiet kiem RAM",
                        "De giam rui ro khi release va rollback nhanh hon",
                        "De thay the database backup",
                        "De tang CPU usage",
                    ],
                    correctIndex: 1,
                    explanation:
                        "Day la chien luoc release an toan, khong phai cach toi uu tai nguyen.",
                },
            },
            {
                id: "devops-4",
                question: "Neu CPU service tang dot bien sau deploy, ban se xu ly nhu the nao?",
                answer:
                    "Dau tien check metrics, logs, tracing va so sanh voi version cu de xac dinh deploy co lien quan hay khong. Neu impact lon can rollback/stop rollout. Sau do phan tich request pattern, worker/process, memory leak, loop bat thuong hoac config thay doi.",
                level: "Nang cao",
                focus: "Incident response",
                tags: ["Monitoring", "Rollback", "Debug"],
                quiz: {
                    choices: [
                        "Tang CPU limit ngay lap tuc va bo qua",
                        "Xac dinh impact, co the rollback, roi moi debug bang metrics/logs/tracing",
                        "Xoa tat ca pod",
                        "Chi restart service nhieu lan",
                    ],
                    correctIndex: 1,
                    explanation:
                        "Incident response tot can uu tien giam impact truoc, sau do moi dieu tra goc re.",
                },
            },
        ],
    },
    {
        id: "qa",
        label: "QA",
        summary: "Test planning, regression, bug reporting va quality mindset.",
        description:
            "Dua vao nhung tinh huong QA pho bien: viet testcase, regression, priority/severity va cach phoi hop voi dev/product.",
        questions: [
            {
                id: "qa-1",
                question: "Phan biet severity va priority cua bug.",
                answer:
                    "Severity do muc do anh huong ky thuat/nguoi dung cua bug. Priority do muc do uu tien can xu ly som hay muon theo business/team. Mot bug co the severity cao nhung priority thap neu khong gap trong flow chinh, va nguoc lai.",
                level: "Co ban",
                focus: "Bug triage",
                tags: ["Bug", "Severity", "Priority"],
                quiz: {
                    choices: [
                        "Severity va priority luon giong nhau",
                        "Severity la anh huong, priority la muc do uu tien xu ly",
                        "Priority do QA quyet, severity do PM quyet",
                        "Severity chi dung cho UI bug",
                    ],
                    correctIndex: 1,
                    explanation:
                        "Day la hai goc nhin khac nhau: mot ben la impact, mot ben la thu tu xu ly.",
                },
            },
            {
                id: "qa-2",
                question: "Mot bug report tot nen co nhung thong tin nao?",
                answer:
                    "Can co title ro rang, moi truong test, buoc tai hien, ket qua thuc te, ket qua mong doi, tan suat xay ra, bang chung nhu screenshot/video/log va neu co thi severity/priority de team xu ly nhanh.",
                level: "Co ban",
                focus: "Documentation",
                tags: ["Bug report", "Communication", "Process"],
                quiz: {
                    choices: [
                        "Chi can screenshot la du",
                        "Chi can noi bug co that",
                        "Can title, steps, actual/expected result, environment va evidence",
                        "Chi can severity",
                    ],
                    correctIndex: 2,
                    explanation:
                        "Bug report tot phai tai hien duoc va giup dev/coordinator ra quyet dinh nhanh.",
                },
            },
            {
                id: "qa-3",
                question: "Regression testing duoc hieu nhu the nao?",
                answer:
                    "Regression testing la kiem tra lai cac chuc nang da co sau khi code thay doi de dam bao fix moi hoac feature moi khong vo tinh gay hong hanh vi cu.",
                level: "Co ban",
                focus: "Regression",
                tags: ["Regression", "Testing", "Release"],
                quiz: {
                    choices: [
                        "La test lai bug da fix va cac vung co nguy co bi anh huong",
                        "La test hieu nang",
                        "La test chi danh cho mobile",
                        "La xoa bot testcase cu",
                    ],
                    correctIndex: 0,
                    explanation:
                        "Regression testing nham phat hien tac dong phu cua thay doi moi len system cu.",
                },
            },
            {
                id: "qa-4",
                question: "Neu requirement chua ro, QA nen lam gi truoc khi viet testcase?",
                answer:
                    "QA nen lam ro requirement voi PM/BA/dev, dat cau hoi ve happy path, edge case, rule nghiep vu va expected behavior. Viet testcase khi chua ro requirement de den test sai huong va bo sot bug quan trong.",
                level: "Trung binh",
                focus: "Requirement analysis",
                tags: ["Requirement", "Testcase", "Communication"],
                quiz: {
                    choices: [
                        "Viet testcase theo cam tinh roi tinh sau",
                        "Cho den luc code xong moi hoi",
                        "Lam ro requirement va edge case truoc khi test design",
                        "Chi test happy path",
                    ],
                    correctIndex: 2,
                    explanation:
                        "Quality bat dau tu viec hieu dung bai toan, khong phai chi tu luc chay testcase.",
                },
            },
        ],
    },
];

export const defaultInterviewRoleId: InterviewRoleId = interviewRoleGroups[0].id;

export function normalizeInterviewRoleId(value: unknown): InterviewRoleId {
    const normalizedValue = Array.isArray(value) ? value[0] : value;
    const matchedRole = interviewRoleGroups.find((role) => role.id === normalizedValue);

    return matchedRole?.id ?? defaultInterviewRoleId;
}

export function getInterviewRole(roleId: unknown): InterviewRoleGroup {
    const normalizedRoleId = normalizeInterviewRoleId(roleId);

    return (
        interviewRoleGroups.find((role) => role.id === normalizedRoleId) ??
        interviewRoleGroups[0]
    );
}
