import { test, expect } from "bun:test"
import { readFile } from "fs/promises"
import { resolve } from "path"

const baseURL = "http://localhost:3000/api/v1/files"

let testFolderId: number = 0 // assuming the test folder ID is fixed for simplicity
let file1Id: number = 0
let file2Id: number = 0

// helper: upload file
async function uploadTestFile(name: string, folderId?: number) {
    const filePath = resolve(`tests/dummy_file/${name}`)
    const buffer = await readFile(filePath)

    const form = new FormData()
    form.append("file", new File([buffer], name))

    const res = await fetch(`${baseURL}/upload${folderId ? `?folderId=${folderId}` : ""}`, {
        method: "POST",
        body: form,
    })

    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.id).toBeDefined()
    return data
}

// create test folder in database
test("POST /folders → create test folder", async () => {
    const res = await fetch("http://localhost:3000/api/v1/folders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: "Test Folder" })
    })
    
    expect(res.status).toBe(200)
    const data = await res.json()

    testFolderId = data.id

    expect(data.id).toBeDefined()
    expect(data.name).toBe("Test Folder")
    expect(data.id).toBe(testFolderId) // assuming the test folder ID is fixed
})

test("POST /files/upload → upload file1.txt", async () => {
    const result = await uploadTestFile("file1.txt", testFolderId)
    file1Id = result.id
    expect(result.name).toBe("file1.txt")
})

test("POST /files/upload → upload file2.txt", async () => {
    const result = await uploadTestFile("file2.txt", testFolderId)
    file2Id = result.id
    expect(result.name).toBe("file2.txt")
})

test("GET /files/folder/:folderId → get files in folder", async () => {
    const res = await fetch(`${baseURL}/folder/${testFolderId}`)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)

    const uploaded = data.map((f: any) => f.name)
    expect(uploaded).toContain("file1.txt")
    expect(uploaded).toContain("file2.txt")
})

test("GET /files/:id → get file1.txt by ID", async () => {
    const res = await fetch(`${baseURL}/${file1Id}`)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.id).toBe(file1Id)
    expect(data.name).toBe("file1.txt")
})

test("DELETE /files/:id → delete file2.txt", async () => {
    const res = await fetch(`${baseURL}/${file2Id}`, {
        method: "DELETE"
    })
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.success ?? true).toBeTruthy()
})


// delete test folder and files
test("DELETE /folders/:id → delete test folder", async () => {
    const res = await fetch(`http://localhost:3000/api/v1/folders/${testFolderId}`, {
        method: "DELETE"
    })
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data.success ?? true).toBeTruthy()
})