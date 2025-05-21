import data from '../data/facts';


export const ArrayQuestionsFacts = (genreType) => {
    const genre = genreType;
    const arrayWithNumberFacts = randomlyInitializeArray(0,29).slice(0,10);
    var targetArray = new Array(10)
    for(var i = 0; i<10; i++){
        var factsNumber = randomlyInitializeArray(0,29).slice(0,4)
        console.log(factsNumber);
        if(!factsNumber.includes(arrayWithNumberFacts[i])){
            var positionValidAnswer = Math.floor(Math.random() * 4);
            factsNumber[positionValidAnswer] = arrayWithNumberFacts[i]
            const question = {
                Fact: data[genre][arrayWithNumberFacts[i]].facts,
                Answer: [
                         data[genre][factsNumber[0]] && data[genre][factsNumber[0]].answer,
                         data[genre][factsNumber[1]] && data[genre][factsNumber[1]].answer,
                         data[genre][factsNumber[2]] && data[genre][factsNumber[2]].answer,
                         data[genre][factsNumber[3]] && data[genre][factsNumber[3]].answer
                ],
                validAnswers: positionValidAnswer + 1,
            }
            targetArray[i] = question
        }
        else{
            const positionValidAnswer = factsNumber.indexOf(arrayWithNumberFacts[i]);
            const question = {
                Fact: data[genre][arrayWithNumberFacts[i]].facts,
                Answer: [
                         data[genre][factsNumber[0]] && data[genre][factsNumber[0]].answer,
                         data[genre][factsNumber[1]] && data[genre][factsNumber[1]].answer,
                         data[genre][factsNumber[2]] && data[genre][factsNumber[2]].answer,
                         data[genre][factsNumber[3]] && data[genre][factsNumber[3]].answer
                ],
                validAnswers: positionValidAnswer + 1,
            }
            targetArray[i] = question;
        }
    }
    return targetArray;
}


export const shuffle = (o) => { //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
    
export const randomlyInitializeArray = (min, max) =>  {
    var start = min;
    var length = max;
    var myArray = [];
    for (var i = 0; start <= length; myArray[i++] = start++);
    return myArray = shuffle(myArray);
}