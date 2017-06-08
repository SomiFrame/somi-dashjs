

function readStream(url,RangeStart,RangeEnd)
    local length = RangeEnd - RangeStart
    local stream
    local file,err = io.open(url,'r')
    if file == nil then
        print('couldnt open file: '..err)
    else
        file:seek("set",RangeStart)
        stream = file:read(length)
        file.close()
    end
    return stream;
end

local videoStream = readStream("./public/video/VivaLaVida_dashinit.mp4",20,200)

print(videoStream)