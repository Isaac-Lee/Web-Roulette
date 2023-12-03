const $c = document.querySelector("canvas");
const ctx = $c.getContext(`2d`);

const start_button = document.querySelector("button");

let person = [];
let colors = [];

const fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", handleFileSelect, false);

function handleFileSelect(event) {
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsBinaryString(event.target.files[0]);
}

function handleFileLoad(event) {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: 'binary' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(worksheet);
    person = json.map(item => `${item.index} ${item.name} ${item.email}`);
    const numColors = person.length;
    colors = Array.from({ length: numColors }, () => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
    newMake();
}

const newMake = () => {
    const [cw, ch] = [$c.width / 2, $c.height / 2];
    const arc = Math.PI / (person.length / 2);
    const degreeOf90 = Math.PI / 2;

    for (let i = 0; i < person.length; i++) {
        const startAngle = arc * i - degreeOf90;

        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(cw, ch);
        ctx.arc(cw, ch, cw, startAngle, startAngle + arc);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "#fff";
        ctx.font = "18px Pretendard";
        ctx.textAlign = "center";

        const angle = startAngle + (arc / 2);

        ctx.save();

        ctx.translate(
            cw + Math.cos(angle) * (cw - 50),
            ch + Math.sin(angle) * (ch - 50),
        );

        ctx.rotate(angle + Math.PI / 2);

        ctx.fillText(person[i].split(" ")[0], 0, 30);

        ctx.restore();
    }
}

const rotate = () => {
    if (person.length === 0) {
        alert("파일이 업로드 되지 않았거나, 목록이 비어있습니다.")
        return;
    }

    start_button.disabled = true;

    $c.style.transform = `initial`;
    $c.style.transition = `initial`;

    setTimeout(() => {
        const ran = Math.floor(Math.random() * person.length);

        const arc = 360 / person.length;
        const rotate = (ran * arc) + 3600 + (arc / 2);

        $c.style.transform = `rotate(-${rotate}deg)`;
        $c.style.transition = `5s`;

        setTimeout(() => {
            alert(`당첨자는 ${person[ran]} 입니다!`)

            person.splice(ran, 1)
            colors.splice(ran, 1)

            newMake()
            $c.style.transition = `0s`;
            $c.style.transform = `rotate(0deg)`;

            setTimeout(() => {
                $c.style.transition = `5s`;
            }, 100);

            start_button.disabled = false;
        }, 5000);
    }, 1);
};

newMake();
