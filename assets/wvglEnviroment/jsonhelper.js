//��ȡ�ļ�
//fileName:�ļ���
//return:js����
function LoadJson(fileName)
{
    var xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('get', fileName, false);
    xhr.overrideMimeType("text/html;charset=utf-8");
    xhr.send(null);
    if (xhr.status === okStatus)
    {
        //console.log(xhr.responseText);
        return JSON.parse(xhr.responseText);
    }
    else
        console.log(xhr.status);
    return null;
}