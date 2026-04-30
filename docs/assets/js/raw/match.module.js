let contentArea = document.getElementById("content");
let imgPrefix = "https://www.philipbkemp.net/alex/clubs/";
let params = {
    lang: "en",
    home: "",
    away: "",
    team_home: "",
    team_away: "",
    events: ""
};
let teams = {};
let texts = {};
let homeScore = 0;
let homeScoreDisplay = null;
let homeLines = null;
let awayScore = 0;
let awayScoreDisplay = null;
let awayLines = null;
let scoreLines = null;

try {
    pullParams();
    const [rTexts,rTeams] = await Promise.all([
        fetch("assets/trans/"+params.lang+".json"),
        fetch("assets/data/teams.json")
    ]);
    texts = await rTexts.json();
    teams = await rTeams.json();
    doneFetch();
} catch ( error ) {
    handleError(error);
}

function rebuildURL() {
    const url = new URL(window.location.href);
    Object.keys(params).forEach(p=>{
        if ( params[p] === "" ) {
            url.searchParams.delete(p);
        } else {
            url.searchParams.set(p,decodeURIComponent(params[p]));
        }
    });
    window.history.pushState({},"",url);
}

function pullParams() {
    window.location.search.replace("?","").split("&").forEach(param=>{
        const parts = param.split("=");
        params[parts[0]] = parts[1];
    });
}

function handleError(error) {
    alert("Error!");
    console.error(error);
}

function doneFetch() {

    let row = document.createElement("DIV");
    row.classList.add("row","mt-5");

    let home = document.createElement("DIV");
    home.classList.add("col-5");
    let homeTeam = document.createElement("DIV");
    homeTeam.classList.add("match-team");
    let homeImg = document.createElement("IMG");
    homeImg.setAttribute("src",imgPrefix + teams[params.home].img);
    homeScoreDisplay = document.createElement("DIV");
    homeScoreDisplay.classList.add("match-score");
    homeScoreDisplay.innerHTML = homeScore;
    homeTeam.append(homeImg);
    homeTeam.append(homeScoreDisplay);
    home.append(homeTeam);

    let away = document.createElement("DIV");
    away.classList.add("col-5","offset-2");
    let awayTeam = document.createElement("DIV");
    awayTeam.classList.add("match-team");
    let awayImg = document.createElement("IMG");
    awayImg.setAttribute("src",imgPrefix + teams[params.away].img);
    awayScoreDisplay = document.createElement("DIV");
    awayScoreDisplay.classList.add("match-score");
    awayScoreDisplay.innerHTML = awayScore;
    awayTeam.append(awayImg);
    awayTeam.append(awayScoreDisplay);
    away.append(awayTeam);

    row.append(home);
    row.append(away);

    let hr = document.createElement("HR");

    contentArea.append(row);
    contentArea.append(hr);

    let rowNotes = document.createElement("DIV");
    rowNotes.classList.add("row","score-wrap");
    rowNotes.setAttribute("id","score-wrap");

    let homeLineWrap = document.createElement("DIV");
    homeLineWrap.classList.add("col-5","score","score-home");
    homeLines = document.createElement("UL");
    homeLineWrap.append(homeLines);
    rowNotes.append(homeLineWrap);

    let scoreLineWrap = document.createElement("DIV");
    scoreLineWrap.classList.add("col-2","score","score-score");
    scoreLines = document.createElement("UL");
    scoreLineWrap.append(scoreLines);
    rowNotes.append(scoreLineWrap);

    let awayLineWrap = document.createElement("DIV");
    awayLineWrap.classList.add("col-5","score","score-away");
    awayLines = document.createElement("UL");
    awayLineWrap.append(awayLines);
    rowNotes.append(awayLineWrap);

    contentArea.append(rowNotes);

    let actions = document.createElement("DIV");
    actions.classList.add("row","fixed-bottom","mb-3","position-fixed","mx-1");
    let actionButtonOne = document.createElement("DIV");
    actionButtonOne.classList.add("col-6");
    let addGoal = document.createElement("BUTTON");
    addGoal.classList.add("btn","btn-outline-primary","mt-2","w-100");
    addGoal.innerHTML = texts.goal;
    addGoal.setAttribute("data-bs-toggle","modal");
    addGoal.setAttribute("data-bs-target","#modalGoal");
    actionButtonOne.append(addGoal);
    let actionButtonTwo = document.createElement("DIV");
    actionButtonTwo.classList.add("col-6");
    let pauseGame = document.createElement("BUTTON");
    pauseGame.classList.add("btn","btn-outline-primary","mt-2","w-100");
    pauseGame.innerHTML = texts.pause;
    actionButtonTwo.append(pauseGame);
    actions.append(actionButtonOne);
    actions.append(actionButtonTwo);
    contentArea.append(actions);

    document.getElementById("goalForHome").innerHTML = texts.select_home;
    document.getElementById("goalForAway").innerHTML = texts.select_away;

    const homeTeamSheet = document.getElementById("modalGoalHomeBtns");
    decodeURIComponent(params.team_home).split("|").forEach(h=>{
        let btn = document.createElement("BUTTON");
        btn.classList.add("btn","btn-outline-primary","w-100","mb-3");
        btn.setAttribute("data-bs-dismiss","modal");
        btn.innerHTML = h;
        btn.addEventListener("click",function(){
            homeScore++;
            homeScoreDisplay.innerHTML = homeScore;
            let newHomeLine = document.createElement("LI");
            newHomeLine.innerHTML = h;
            homeLines.append(newHomeLine);
            let newScoreLine = document.createElement("LI");
            newScoreLine.innerHTML = homeScore + "-" + awayScore;
            scoreLines.append(newScoreLine);
            let newAwayLine = document.createElement("LI");
            newAwayLine.innerHTML = "&nbsp;";
            awayLines.append(newAwayLine);

            const container = document.getElementById('score-wrap');
            container.scrollTop = container.scrollHeight;
        });
        homeTeamSheet.append(btn);
    });

    const awayTeamSheet = document.getElementById("modalGoalAwayBtns");
    decodeURIComponent(params.team_away).split("|").forEach(h=>{
        let btn = document.createElement("BUTTON");
        btn.classList.add("btn","btn-outline-primary","w-100","mb-3");
        btn.setAttribute("data-bs-dismiss","modal");
        btn.innerHTML = h;
        btn.addEventListener("click",function(){
            awayScore++;
            awayScoreDisplay.innerHTML = awayScore;
            let newHomeLine = document.createElement("LI");
            newHomeLine.innerHTML = "&nbsp";
            homeLines.append(newHomeLine);
            let newScoreLine = document.createElement("LI");
            newScoreLine.innerHTML = homeScore + "-" + awayScore;
            scoreLines.append(newScoreLine);
            let newAwayLine = document.createElement("LI");
            newAwayLine.innerHTML = h;
            awayLines.append(newAwayLine);

            const container = document.getElementById('score-wrap');
            container.scrollTop = container.scrollHeight;
        });
        awayTeamSheet.append(btn);
    });

}