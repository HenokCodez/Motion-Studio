#!/usr/bin/env python3
"""
Premiere Pro Timeline Assembler (FCP 7 / Premiere XML Interchange)
Assembles a complete, multi-track, 100% editable Premiere Pro project XML
with video tracks (V1: Background, V2: B-Roll & Memes, V3: Remotion Alpha Overlays),
and audio tracks (A1: Narration, A2: SFX, A3: Background Music).
"""
import os
import urllib.parse
import xml.etree.ElementTree as ET
from xml.dom import minidom
from pathlib import Path

def to_pathurl(filepath: Path) -> str:
    """Convert absolute Windows path to valid file://localhost/ URL with encoded colons/spaces."""
    resolved = filepath.resolve().as_posix()
    # On Windows, e.g. D:/Automations/...
    if len(resolved) > 1 and resolved[1] == ":":
        drive = resolved[0]
        rest = resolved[2:]
        return f"file://localhost/{drive}%3a{urllib.parse.quote(rest)}"
    return f"file://localhost{urllib.parse.quote(resolved)}"

def create_file_elem(file_id: str, filepath: Path, duration_frames: int, has_video: bool = True, has_audio: bool = False, width: int = 1920, height: int = 1080):
    elem = ET.Element("file", id=file_id)
    ET.SubElement(elem, "name").text = filepath.name
    ET.SubElement(elem, "pathurl").text = to_pathurl(filepath)
    
    rate = ET.SubElement(elem, "rate")
    ET.SubElement(rate, "timebase").text = "30"
    ET.SubElement(rate, "ntsc").text = "FALSE"
    
    ET.SubElement(elem, "duration").text = str(duration_frames)
    
    media = ET.SubElement(elem, "media")
    if has_video:
        video = ET.SubElement(media, "video")
        sample = ET.SubElement(video, "samplecharacteristics")
        ET.SubElement(sample, "width").text = str(width)
        ET.SubElement(sample, "height").text = str(height)
    if has_audio:
        audio = ET.SubElement(media, "audio")
        sample = ET.SubElement(audio, "samplecharacteristics")
        ET.SubElement(sample, "depth").text = "16"
        ET.SubElement(sample, "samplerate").text = "48000"
    return elem

def create_clipitem(
    clip_id: str,
    name: str,
    file_id: str,
    filepath: Path,
    start_frame: int,
    end_frame: int,
    in_frame: int = 0,
    out_frame: int = None,
    file_duration: int = None,
    has_video: bool = True,
    has_audio: bool = False,
    volume_level_db: float = None
):
    duration = end_frame - start_frame
    if out_frame is None:
        out_frame = in_frame + duration
    if file_duration is None:
        file_duration = max(out_frame, duration)
        
    clip = ET.Element("clipitem", id=clip_id)
    ET.SubElement(clip, "name").text = name
    ET.SubElement(clip, "duration").text = str(duration)
    
    rate = ET.SubElement(clip, "rate")
    ET.SubElement(rate, "timebase").text = "30"
    ET.SubElement(rate, "ntsc").text = "FALSE"
    
    ET.SubElement(clip, "start").text = str(start_frame)
    ET.SubElement(clip, "end").text = str(end_frame)
    ET.SubElement(clip, "in").text = str(in_frame)
    ET.SubElement(clip, "out").text = str(out_frame)
    
    # Nested file element
    file_elem = create_file_elem(file_id, filepath, file_duration, has_video=has_video, has_audio=has_audio)
    clip.append(file_elem)
    
    # Audio volume filter if specified
    if has_audio and volume_level_db is not None:
        # Convert dB to linear gain: e.g. -22dB is approx 0.08
        filter_elem = ET.SubElement(clip, "filter")
        effect_elem = ET.SubElement(filter_elem, "effect")
        ET.SubElement(effect_elem, "name").text = "Audio Levels"
        ET.SubElement(effect_elem, "effectid").text = "audiolevels"
        param = ET.SubElement(effect_elem, "parameter")
        ET.SubElement(param, "parameterid").text = "level"
        ET.SubElement(param, "name").text = "Level"
        ET.SubElement(param, "valuemin").text = "0"
        ET.SubElement(param, "valuemax").text = "2"
        # Linear gain ratio: 10^(dB/20)
        gain = 10.0 ** (volume_level_db / 20.0)
        ET.SubElement(param, "value").text = str(round(gain, 4))
        
    return clip

def build_premiere_xml(
    output_xml_path: Path,
    sequence_name: str = "VantaBrief_60s_POC",
    total_frames: int = 1800,
    fps: int = 30
):
    root = ET.Element("xmeml", version="4")
    project = ET.SubElement(root, "project")
    ET.SubElement(project, "name").text = "VantaBrief Automation Studio"
    
    children = ET.SubElement(project, "children")
    sequence = ET.SubElement(children, "sequence")
    ET.SubElement(sequence, "name").text = sequence_name
    ET.SubElement(sequence, "duration").text = str(total_frames)
    
    seq_rate = ET.SubElement(sequence, "rate")
    ET.SubElement(seq_rate, "timebase").text = str(fps)
    ET.SubElement(seq_rate, "ntsc").text = "FALSE"
    
    media = ET.SubElement(sequence, "media")
    video = ET.SubElement(media, "video")
    
    # Sequence video format
    v_format = ET.SubElement(video, "format")
    v_sample = ET.SubElement(v_format, "samplecharacteristics")
    ET.SubElement(v_sample, "width").text = "1920"
    ET.SubElement(v_sample, "height").text = "1080"
    ET.SubElement(v_sample, "pixelaspectratio").text = "square"
    
    # ── Video Track 1: Matte Background ────────────────────────────────
    v_track_1 = ET.SubElement(video, "track")
    bg_video_path = output_xml_path.parent / "assets" / "video" / "matte_background_60s.mp4"
    clip_bg = create_clipitem(
        clip_id="clipitem-bg-1",
        name="Matte_Background_Plate",
        file_id="file-bg-1",
        filepath=bg_video_path,
        start_frame=0,
        end_frame=total_frames,
        in_frame=0,
        out_frame=total_frames,
        file_duration=total_frames,
        has_video=True,
        has_audio=False
    )
    v_track_1.append(clip_bg)
    
    # ── Video Track 2: B-Roll, UI Screenshots & Memes ──────────────────
    v_track_2 = ET.SubElement(video, "track")
    assets_dir = output_xml_path.parent / "assets"
    
    v2_clips = [
        # (name, path, start_frame, end_frame, in_frame, out_frame, is_video)
        ("ArtCraft_UI", assets_dir / "images" / "artcraft_ui.jpg", 120, 270, 0, 150, True),
        ("Meme_Michael_Rosen_Nice", assets_dir / "memes" / "Michael_Rosen___Nice.mp4", 270, 360, 0, 90, True),
        ("Kokoro_GitHub", assets_dir / "images" / "kokoro_github.png", 360, 540, 0, 180, True),
        # Gap 540-660: Remotion MG2 is prominently showcased here
        ("Sam_Altman_Tech", assets_dir / "images" / "sam_altman.png", 660, 810, 0, 150, True),
        ("Meme_HEHE_BOI", assets_dir / "memes" / "HEHE_BOI.mp4", 810, 930, 0, 120, True),
        ("DaVinci_Resolve_Site", assets_dir / "images" / "davinci_site.png", 930, 1170, 0, 240, True),
        ("Meme_Ron_Swanson_Trash", assets_dir / "memes" / "ron_swanson_Throw_Computer_in_Trash_Meme_TEMP_CFR.mp4", 1170, 1380, 0, 210, True),
        ("Blender_3D_Site", assets_dir / "images" / "blender_site.png", 1380, 1530, 0, 150, True),
        # Gap 1530-1680: Remotion MG3 Comparison Grid showcased here
        ("Bill_Gates_Legacy", assets_dir / "images" / "bill_gates.png", 1680, 1800, 0, 120, True),
    ]
    
    for idx, (name, path, sf, ef, inf, outf, is_vid) in enumerate(v2_clips, 1):
        if path.exists():
            clip_item = create_clipitem(
                clip_id=f"clipitem-v2-{idx}",
                name=name,
                file_id=f"file-v2-{idx}",
                filepath=path,
                start_frame=sf,
                end_frame=ef,
                in_frame=inf,
                out_frame=outf,
                file_duration=outf,
                has_video=is_vid,
                has_audio=False
            )
            v_track_2.append(clip_item)
            
    # ── Video Track 3: Remotion Transparent Motion Graphics (Alpha Overlays)
    v_track_3 = ET.SubElement(video, "track")
    renders_dir = output_xml_path.parent / "renders"
    
    remotion_clips = [
        ("Remotion_MG1_TitleHook", renders_dir / "remotion_mg1.mov", 0, 120, 0, 120),
        ("Remotion_MG2_CalloutCard", renders_dir / "remotion_mg2.mov", 540, 660, 0, 120),
        ("Remotion_MG3_ComparisonGrid", renders_dir / "remotion_mg3.mov", 1530, 1680, 0, 150),
    ]
    
    for idx, (name, path, sf, ef, inf, outf) in enumerate(remotion_clips, 1):
        if path.exists():
            clip_item = create_clipitem(
                clip_id=f"clipitem-v3-{idx}",
                name=name,
                file_id=f"file-v3-{idx}",
                filepath=path,
                start_frame=sf,
                end_frame=ef,
                in_frame=inf,
                out_frame=outf,
                file_duration=outf,
                has_video=True,
                has_audio=False
            )
            v_track_3.append(clip_item)
            
    # ── Audio Tracks ───────────────────────────────────────────────────
    audio = ET.SubElement(media, "audio")
    a_sample = ET.SubElement(audio, "samplecharacteristics")
    ET.SubElement(a_sample, "depth").text = "16"
    ET.SubElement(a_sample, "samplerate").text = "48000"
    
    # ── Audio Track 1: Tightened Narration (Silences Removed) ───────────
    a_track_1 = ET.SubElement(audio, "track")
    narration_path = assets_dir / "audio" / "voice" / "narration_tight_60s.wav"
    clip_narr = create_clipitem(
        clip_id="clipitem-a1-1",
        name="Tight_Narration_60s",
        file_id="file-a1-1",
        filepath=narration_path,
        start_frame=0,
        end_frame=total_frames,
        in_frame=0,
        out_frame=total_frames,
        file_duration=total_frames,
        has_video=False,
        has_audio=True
    )
    a_track_1.append(clip_narr)
    
    # ── Audio Track 2: SFX Accents & Meme Soundbites ───────────────────
    a_track_2 = ET.SubElement(audio, "track")
    sfx_dir = assets_dir / "sfx"
    sfx_events = [
        ("SFX_Whoosh_Intro", sfx_dir / "whoosh.mp3", 0, 30, 0, 30),
        ("SFX_Pop_ArtCraft", sfx_dir / "pop.mp3", 120, 150, 0, 30),
        ("SFX_Impact_Kokoro", sfx_dir / "impact.wav", 360, 400, 0, 40),
        ("SFX_Whoosh_Callout", sfx_dir / "whoosh.mp3", 540, 570, 0, 30),
        ("SFX_Pop_HeheBoi", sfx_dir / "pop.mp3", 810, 840, 0, 30),
        ("SFX_Whoosh_Comparison", sfx_dir / "whoosh.mp3", 1530, 1560, 0, 30),
    ]
    for idx, (name, path, sf, ef, inf, outf) in enumerate(sfx_events, 1):
        if path.exists():
            clip_item = create_clipitem(
                clip_id=f"clipitem-a2-{idx}",
                name=name,
                file_id=f"file-a2-{idx}",
                filepath=path,
                start_frame=sf,
                end_frame=ef,
                in_frame=inf,
                out_frame=outf,
                file_duration=outf,
                has_video=False,
                has_audio=True
            )
            a_track_2.append(clip_item)
            
    # ── Audio Track 3: Background Music (Ducked) ───────────────────────
    a_track_3 = ET.SubElement(audio, "track")
    music_path = assets_dir / "music" / "bg_music.mp3"
    clip_music = create_clipitem(
        clip_id="clipitem-a3-1",
        name="LoFi_Background_Music_Ducked",
        file_id="file-a3-1",
        filepath=music_path,
        start_frame=0,
        end_frame=total_frames,
        in_frame=0,
        out_frame=total_frames,
        file_duration=total_frames,
        has_video=False,
        has_audio=True,
        volume_level_db=-22.0  # Ducked under voiceover
    )
    a_track_3.append(clip_music)
    
    # Pretty-print XML
    xml_str = minidom.parseString(ET.tostring(root, encoding="utf-8")).toprettyxml(indent="  ")
    output_xml_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_xml_path, "w", encoding="utf-8") as f:
        f.write(xml_str)
        
    print(f"\n=======================================================")
    print(f"Successfully generated Premiere Pro Interchange XML:")
    print(f"  File: {output_xml_path.resolve()}")
    print(f"  Duration: {total_frames} frames ({total_frames/fps}s at {fps}fps)")
    print(f"  Tracks: 3 Video Tracks (V1-V3), 3 Audio Tracks (A1-A3)")
    print(f"=======================================================\n")

if __name__ == "__main__":
    out_xml = Path("Videos/premiere-poc-60s/premiere_test_60s.xml")
    build_premiere_xml(out_xml, total_frames=1800, fps=30)
