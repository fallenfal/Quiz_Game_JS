
let js = 'beginning'
console.log(js)

if (js === "beginning"){
    console.log("function")
}
let doc = document.getElementsByTagName('p');
const para = document.getElementById('score-output');
const button = document.getElementById("btn-score")
const buttonSaveProgress = document.getElementById("save-progress")
const buttonRedirectHome = document.getElementById("redirect-home")


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const link = urlParams.get('quiz');
console.log(link)
const questionTag = document.getElementsByClassName('question');


async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

function shuffle(array) {
    const shuffled = array.sort(() => Math.random() - 0.5);
    return shuffled
}

function checkIfSelected(){

    const radioButtons = document.querySelectorAll('input[name="size"]');
    questionTag[0].addEventListener("click", () => {
        let selectedSize;
        for (const radioButton of radioButtons) {
            if (radioButton.checked) {
                selectedSize = radioButton.value;
                break;
            }
        }
        // show the output:
        return selectedSize
    });

}


function HTMLtags(string){
    let split = string.split(" ")
    let newString = []

    let escapeChars = {
        '¢' : '&cent;',
        '£' : '&pound;',
        '¥' : '&yen;',
        '€': '&euro;',
        '©' :'&copy;',
        '®' : '&reg;',
        '<' : '&lt;',
        '>' : '&gt;',
        '"' : '&quot;',
        '&' : '&amp;',
        '\'' : '&#39;'
    };


}

function escapeHtml(unsafe)
{
    return unsafe
        .replaceAll("&#039;","'")
        .replaceAll("&cent;","¢")
        .replaceAll("&pound;","£")
        .replaceAll("&yen;","¥")
        .replaceAll("&euro;","€")
        .replaceAll("&copy;","©")
        .replaceAll("&reg;","®")
        .replaceAll("&lt;","<")
        .replaceAll("&gt;",">")
        .replaceAll("&quot;","\"")
        .replaceAll("&amp;","&")

}


function createQuestionTags(question,index){
    const HTMLElement = document.createElement("div")
    HTMLElement.setAttribute("class", "single-question")

    // title of the question
    const questionTitle = document.createElement("h1");
    questionTitle.innerText = escapeHtml(question.question);
    HTMLElement.appendChild(questionTitle);


    // category of the question
    const questionCategory = document.createElement("p");
    questionCategory.innerText = escapeHtml(question.category);
    questionCategory.setAttribute("class", "category")
    HTMLElement.appendChild(questionCategory);

    // answers of te question

    let newIncorrect = question.incorrect_answers.forEach((el) => {
        return escapeHtml(el)
    })

    const tempAnswers = [...question.incorrect_answers, escapeHtml(question.correct_answer)];
    const answers = shuffle(tempAnswers);
    // console.log(answers)

    let currIndex = index
    createAnswersInputs(answers,HTMLElement,currIndex)
    questionTag[0].appendChild(HTMLElement)


}


function createAnswersInputs(answers,HTMLElement,currIndex) {
    answers.forEach((element,index) => {
        const questionAnswer = document.createElement("input");
        const label = document.createElement("label");
        label.setAttribute("for", currIndex+ "-" + index)
        label.innerText = element
        questionAnswer.setAttribute("type", "radio")
        questionAnswer.setAttribute("name", "answer" + currIndex)
        questionAnswer.setAttribute("value", element)
        questionAnswer.setAttribute("class", "radio-answer")
        questionAnswer.setAttribute("id", currIndex+ "-" + index)
        questionAnswer.innerText = element;
        HTMLElement.appendChild(questionAnswer);
        HTMLElement.appendChild(label);
    })
}

async function processingFunction(){                      // change to async
    const url = link + "&amount=10"
    const database_data = await fetchData(url);
    //console.log(database_data)

    // doc[0].innerHTML = database_data.results.category;
    database_data.results.forEach((element, index)=>{
        createQuestionTags(database_data.results[index],index)
    })

    const questions = document.getElementsByClassName("single-question")
    const correct_answers = []
    let score = 0
    Array.from(questions).forEach((element,index) => {
        // console.log(element)
        let selector = "input[name=\"answer" +index +"\"]"
        const input = element.querySelectorAll(selector)
        // console.log(input)


        input.forEach(function (elem, index2) {
            // console.log(elem)
            elem.addEventListener("change", function(event) {
                let item = event.target.value;
                // console.log(item, index2)
                correct_answers[index] = item
            });
        })

        // input.querySelectorAll('input[name="answer"]').addEventListener("change", function(event) {
        //     const item = event.target.value;
        //     console.log(item)
        // });
    })

    button.addEventListener("click", function(){
        correct_answers.forEach((e,i)=>{
            if(e === escapeHtml(database_data.results[i].correct_answer)){
                score += 10
            }
        })
        para.innerHTML = score
    })

    buttonSaveProgress.addEventListener("click", function (){
        window.location.href = window.location.hostname + "/upload.php";
    })

    buttonRedirectHome.addEventListener("click", function () {
        window.location.href = window.location.hostname;
    })


    return database_data.results
}



processingFunction()



